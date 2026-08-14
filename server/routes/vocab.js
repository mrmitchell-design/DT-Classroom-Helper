const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

function serializeProgress(row) {
  return {
    termId: row.term_id,
    familiarity: row.familiarity,
    correctCount: row.correct_count,
    attemptCount: row.attempt_count,
    correctStyles: JSON.parse(row.correct_styles || "[]"),
    markedForPractice: !!row.marked_for_practice,
    lastPractisedAt: row.last_practised_at,
  };
}

router.get("/progress", (req, res) => {
  const rows = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ?").all(req.session.userId);
  res.json(rows.map(serializeProgress));
});

router.post("/progress/:termId/attempt", (req, res) => {
  const { correct, questionType } = req.body || {};
  const { termId } = req.params;
  const existing = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, termId);

  const correctStyles = new Set(existing ? JSON.parse(existing.correct_styles || "[]") : []);
  const correctCount = (existing ? existing.correct_count : 0) + (correct ? 1 : 0);
  const attemptCount = (existing ? existing.attempt_count : 0) + 1;
  if (correct && questionType) correctStyles.add(questionType);

  let familiarity;
  if (!correct) {
    familiarity = "practising";
  } else if (correctCount >= 3 && correctStyles.size >= 2) {
    familiarity = "confident";
  } else {
    familiarity = "practising";
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  if (existing) {
    db.prepare(
      `UPDATE vocab_progress SET familiarity = ?, correct_count = ?, attempt_count = ?, correct_styles = ?, last_practised_at = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(familiarity, correctCount, attemptCount, JSON.stringify([...correctStyles]), now, existing.id);
  } else {
    db.prepare(
      `INSERT INTO vocab_progress (user_id, term_id, familiarity, correct_count, attempt_count, correct_styles, last_practised_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(req.session.userId, termId, familiarity, correctCount, attemptCount, JSON.stringify([...correctStyles]), now);
  }
  const row = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, termId);
  res.json(serializeProgress(row));
});

router.post("/progress/:termId/viewed", (req, res) => {
  const { termId } = req.params;
  const existing = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, termId);
  if (!existing) {
    db.prepare("INSERT INTO vocab_progress (user_id, term_id, familiarity) VALUES (?, ?, 'learning')").run(req.session.userId, termId);
  }
  const row = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, termId);
  res.json(serializeProgress(row));
});

router.post("/progress/:termId/mark", (req, res) => {
  const { marked } = req.body || {};
  const { termId } = req.params;
  const existing = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, termId);
  if (existing) {
    db.prepare("UPDATE vocab_progress SET marked_for_practice = ?, updated_at = datetime('now') WHERE id = ?").run(marked ? 1 : 0, existing.id);
  } else {
    db.prepare("INSERT INTO vocab_progress (user_id, term_id, familiarity, marked_for_practice) VALUES (?, ?, 'learning', ?)").run(req.session.userId, termId, marked ? 1 : 0);
  }
  const row = db.prepare("SELECT * FROM vocab_progress WHERE user_id = ? AND term_id = ?").get(req.session.userId, termId);
  res.json(serializeProgress(row));
});

router.post("/quiz-attempts", (req, res) => {
  const { mode, category, score, total, details } = req.body || {};
  if (!mode || !Number.isInteger(score) || !Number.isInteger(total)) {
    return res.status(400).json({ error: "mode, score and total are required." });
  }
  const info = db
    .prepare("INSERT INTO vocab_quiz_attempts (user_id, mode, category, score, total, details) VALUES (?, ?, ?, ?, ?, ?)")
    .run(req.session.userId, mode, category || null, score, total, JSON.stringify(details || []));
  res.status(201).json({ id: info.lastInsertRowid });
});

router.get("/quiz-attempts", (req, res) => {
  const rows = db.prepare("SELECT * FROM vocab_quiz_attempts WHERE user_id = ? ORDER BY taken_at DESC LIMIT 20").all(req.session.userId);
  res.json(rows.map((r) => ({
    id: r.id, mode: r.mode, category: r.category, score: r.score, total: r.total, takenAt: r.taken_at,
  })));
});

module.exports = router;
