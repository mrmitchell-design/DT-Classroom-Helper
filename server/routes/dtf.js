const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

function serializeProgress(row) {
  return {
    unitKey: row.unit_key,
    sectionKey: row.section_key,
    knowledgeScore: row.knowledge_score,
    suggestedStage: row.suggested_stage,
    confirmedStage: row.confirmed_stage,
    stageReasoning: row.stage_reasoning || "",
    completedAt: row.completed_at,
    sessionState: JSON.parse(row.session_state || "{}"),
    updatedAt: row.updated_at,
  };
}

router.get("/progress", (req, res) => {
  const rows = db.prepare("SELECT * FROM dtf_section_progress WHERE user_id = ?").all(req.session.userId);
  res.json(rows.map(serializeProgress));
});

router.put("/progress/:unitKey/:sectionKey", (req, res) => {
  const { knowledgeScore, suggestedStage, stageReasoning, completed, sessionState } = req.body || {};
  const { unitKey, sectionKey } = req.params;
  const sessionStateJson = sessionState !== undefined ? JSON.stringify(sessionState) : null;
  const existing = db.prepare("SELECT * FROM dtf_section_progress WHERE user_id = ? AND unit_key = ? AND section_key = ?").get(req.session.userId, unitKey, sectionKey);
  if (existing) {
    db.prepare(
      `UPDATE dtf_section_progress SET
         knowledge_score = COALESCE(?, knowledge_score),
         suggested_stage = COALESCE(?, suggested_stage),
         stage_reasoning = COALESCE(?, stage_reasoning),
         session_state = COALESCE(?, session_state),
         completed_at = CASE WHEN ? = 1 THEN COALESCE(completed_at, datetime('now')) ELSE completed_at END,
         updated_at = datetime('now')
       WHERE id = ?`
    ).run(knowledgeScore ?? null, suggestedStage ?? null, stageReasoning ?? null, sessionStateJson, completed ? 1 : 0, existing.id);
  } else {
    db.prepare(
      `INSERT INTO dtf_section_progress (user_id, unit_key, section_key, knowledge_score, suggested_stage, stage_reasoning, session_state, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(req.session.userId, unitKey, sectionKey, knowledgeScore ?? null, suggestedStage ?? null, stageReasoning || "", sessionStateJson || "{}", completed ? new Date().toISOString().replace("T", " ").slice(0, 19) : null);
  }
  const row = db.prepare("SELECT * FROM dtf_section_progress WHERE user_id = ? AND unit_key = ? AND section_key = ?").get(req.session.userId, unitKey, sectionKey);
  res.json(serializeProgress(row));
});

const VALID_ATTEMPT_TYPES = ["micro", "section", "checkpoint", "endofunit", "final"];

router.get("/attempts", (req, res) => {
  const rows = db.prepare("SELECT * FROM dtf_attempts WHERE user_id = ? ORDER BY taken_at DESC LIMIT 50").all(req.session.userId);
  res.json(rows.map((r) => ({
    id: r.id, unitKey: r.unit_key, sectionKey: r.section_key, attemptType: r.attempt_type,
    score: r.score, total: r.total, durationSeconds: r.duration_seconds, takenAt: r.taken_at,
  })));
});

router.post("/attempts", (req, res) => {
  const { unitKey, sectionKey, attemptType, score, total, details, durationSeconds } = req.body || {};
  if (!unitKey || !VALID_ATTEMPT_TYPES.includes(attemptType)) {
    return res.status(400).json({ error: "unitKey and a valid attemptType are required." });
  }
  if (!Number.isInteger(score) || !Number.isInteger(total) || score < 0 || total <= 0 || score > total) {
    return res.status(400).json({ error: "Invalid score/total." });
  }
  const info = db.prepare(
    `INSERT INTO dtf_attempts (user_id, unit_key, section_key, attempt_type, score, total, details, duration_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.session.userId, unitKey, sectionKey || null, attemptType, score, total, JSON.stringify(details || []), durationSeconds ?? null);
  res.status(201).json({ id: info.lastInsertRowid });
});

function serializeResponse(row) {
  return {
    questionId: row.question_id,
    firstResponse: row.first_response,
    refinedResponse: row.refined_response,
    suggestedStage: row.suggested_stage,
    stageReasoning: row.stage_reasoning || "",
    teacherFeedback: row.teacher_feedback || "",
    teacherStage: row.teacher_stage,
    markedComplete: !!row.marked_complete,
    updatedAt: row.updated_at,
  };
}

router.get("/responses/:questionId", (req, res) => {
  const row = db.prepare("SELECT * FROM dtf_responses WHERE user_id = ? AND question_id = ?").get(req.session.userId, req.params.questionId);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(serializeResponse(row));
});

router.post("/responses/:questionId", (req, res) => {
  const { text, suggestedStage, stageReasoning, isRefinement } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: "text is required." });

  const existing = db.prepare("SELECT * FROM dtf_responses WHERE user_id = ? AND question_id = ?").get(req.session.userId, req.params.questionId);

  if (!existing) {
    db.prepare(
      `INSERT INTO dtf_responses (user_id, question_id, first_response, suggested_stage, stage_reasoning)
       VALUES (?, ?, ?, ?, ?)`
    ).run(req.session.userId, req.params.questionId, text, suggestedStage || null, stageReasoning || "");
  } else if (isRefinement) {
    db.prepare(
      `UPDATE dtf_responses SET refined_response = ?, suggested_stage = ?, stage_reasoning = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(text, suggestedStage || existing.suggested_stage, stageReasoning || existing.stage_reasoning, existing.id);
  } else {
    db.prepare(
      `UPDATE dtf_responses SET first_response = ?, suggested_stage = ?, stage_reasoning = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(text, suggestedStage || null, stageReasoning || "", existing.id);
  }

  const row = db.prepare("SELECT * FROM dtf_responses WHERE user_id = ? AND question_id = ?").get(req.session.userId, req.params.questionId);
  res.json(serializeResponse(row));
});

router.get("/vocab", (req, res) => {
  const rows = db.prepare("SELECT * FROM dtf_vocab_progress WHERE user_id = ?").all(req.session.userId);
  res.json(rows.map((r) => ({ termId: r.term_id, familiarity: r.familiarity, correctCount: r.correct_count, attemptCount: r.attempt_count })));
});

router.post("/vocab/:termId", (req, res) => {
  const { correct } = req.body || {};
  const existing = db.prepare("SELECT * FROM dtf_vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, req.params.termId);
  const nextCorrect = (existing ? existing.correct_count : 0) + (correct ? 1 : 0);
  const nextAttempts = (existing ? existing.attempt_count : 0) + 1;
  const familiarity = nextAttempts >= 3 && nextCorrect / nextAttempts >= 0.8 ? "confident" : nextAttempts >= 1 ? "practising" : "new";
  if (existing) {
    db.prepare("UPDATE dtf_vocab_progress SET familiarity = ?, correct_count = ?, attempt_count = ?, updated_at = datetime('now') WHERE id = ?")
      .run(familiarity, nextCorrect, nextAttempts, existing.id);
  } else {
    db.prepare("INSERT INTO dtf_vocab_progress (user_id, term_id, familiarity, correct_count, attempt_count) VALUES (?, ?, ?, ?, ?)")
      .run(req.session.userId, req.params.termId, familiarity, nextCorrect, nextAttempts);
  }
  res.json({ ok: true, familiarity });
});

module.exports = router;
