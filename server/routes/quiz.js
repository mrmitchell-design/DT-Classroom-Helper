const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

const VALID_SETS = ["accessfm", "scamper", "mixed"];
const VALID_DIFFICULTIES = ["standard", "challenge", "extension"];
const MAX_DETAILS_JSON_LENGTH = 50000; // sanity cap, well above any real quiz size

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, module, quiz_set, difficulty, score, total, duration_seconds, feedback, taken_at
       FROM quiz_attempts WHERE user_id = ? ORDER BY taken_at DESC LIMIT 20`
    )
    .all(req.session.userId);
  res.json(
    rows.map((r) => ({
      id: r.id,
      module: r.module,
      quizSet: r.quiz_set,
      difficulty: r.difficulty,
      score: r.score,
      total: r.total,
      durationSeconds: r.duration_seconds,
      feedback: r.feedback || "",
      takenAt: r.taken_at,
    }))
  );
});

// fetch one of the requester's own attempts, including full Q&A detail and
// any feedback left by the admin - used so a student can review a past quiz.
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?").get(req.params.id, req.session.userId);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    id: row.id,
    module: row.module,
    quizSet: row.quiz_set,
    difficulty: row.difficulty,
    score: row.score,
    total: row.total,
    durationSeconds: row.duration_seconds,
    feedback: row.feedback || "",
    details: JSON.parse(row.details || "[]"),
    takenAt: row.taken_at,
  });
});

router.post("/", (req, res) => {
  const { module = "accessfm_scamper", quizSet, difficulty = "standard", score, total, durationSeconds, details, quizSetId } = req.body || {};
  if (!VALID_SETS.includes(quizSet)) return res.status(400).json({ error: "Invalid quizSet." });
  if (!VALID_DIFFICULTIES.includes(difficulty)) return res.status(400).json({ error: "Invalid difficulty." });
  if (!Number.isInteger(score) || !Number.isInteger(total) || score < 0 || total <= 0 || score > total) {
    return res.status(400).json({ error: "Invalid score/total." });
  }
  let durationVal = null;
  if (durationSeconds !== undefined && durationSeconds !== null) {
    if (!Number.isInteger(durationSeconds) || durationSeconds < 0 || durationSeconds > 86400) {
      return res.status(400).json({ error: "Invalid durationSeconds." });
    }
    durationVal = durationSeconds;
  }
  let detailsJson = "[]";
  if (Array.isArray(details)) {
    const json = JSON.stringify(details);
    if (json.length <= MAX_DETAILS_JSON_LENGTH) detailsJson = json;
    // if it's implausibly large, silently drop it rather than fail the whole
    // submission - the score/total still get recorded either way.
  }
  let quizSetIdVal = null;
  if (quizSetId !== undefined && quizSetId !== null) {
    const set = db.prepare("SELECT id FROM quiz_sets WHERE id = ?").get(quizSetId);
    if (set) quizSetIdVal = set.id;
  }
  const info = db
    .prepare(
      `INSERT INTO quiz_attempts (user_id, module, quiz_set, difficulty, score, total, duration_seconds, details, quiz_set_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.session.userId, module, quizSet, difficulty, score, total, durationVal, detailsJson, quizSetIdVal);
  res.status(201).json({ id: info.lastInsertRowid });
});

module.exports = router;
