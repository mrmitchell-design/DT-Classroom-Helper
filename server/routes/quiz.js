const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

const VALID_SETS = ["accessfm", "scamper", "mixed"];
const VALID_DIFFICULTIES = ["standard", "challenge", "extension"];

router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, module, quiz_set, difficulty, score, total, taken_at
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
      takenAt: r.taken_at,
    }))
  );
});

router.post("/", (req, res) => {
  const { module = "accessfm_scamper", quizSet, difficulty = "standard", score, total } = req.body || {};
  if (!VALID_SETS.includes(quizSet)) return res.status(400).json({ error: "Invalid quizSet." });
  if (!VALID_DIFFICULTIES.includes(difficulty)) return res.status(400).json({ error: "Invalid difficulty." });
  if (!Number.isInteger(score) || !Number.isInteger(total) || score < 0 || total <= 0 || score > total) {
    return res.status(400).json({ error: "Invalid score/total." });
  }
  const info = db
    .prepare(
      `INSERT INTO quiz_attempts (user_id, module, quiz_set, difficulty, score, total) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.session.userId, module, quizSet, difficulty, score, total);
  res.status(201).json({ id: info.lastInsertRowid });
});

module.exports = router;
