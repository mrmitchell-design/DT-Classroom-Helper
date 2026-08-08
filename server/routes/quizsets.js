const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth");

const router = express.Router();
router.use(requireAdmin);

function serializeSet(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    questions: JSON.parse(row.questions || "[]"),
    isPracticeBank: !!row.is_practice_bank,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get("/quiz-sets", (req, res) => {
  const rows = db.prepare("SELECT * FROM quiz_sets ORDER BY updated_at DESC").all();
  res.json(rows.map(serializeSet));
});

router.get("/quiz-sets/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM quiz_sets WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Quiz set not found." });
  res.json(serializeSet(row));
});

router.post("/quiz-sets", (req, res) => {
  const { name, description, questions, isPracticeBank } = req.body || {};
  if (!name || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "name and a non-empty questions array are required." });
  }
  const info = db
    .prepare("INSERT INTO quiz_sets (name, description, questions, is_practice_bank, created_by) VALUES (?, ?, ?, ?, ?)")
    .run(name, description || "", JSON.stringify(questions), isPracticeBank ? 1 : 0, req.session.userId);
  const row = db.prepare("SELECT * FROM quiz_sets WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(serializeSet(row));
});

router.put("/quiz-sets/:id", (req, res) => {
  const existing = db.prepare("SELECT id FROM quiz_sets WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Quiz set not found." });
  const { name, description, questions, isPracticeBank } = req.body || {};
  if (!name || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "name and a non-empty questions array are required." });
  }
  db.prepare("UPDATE quiz_sets SET name = ?, description = ?, questions = ?, is_practice_bank = ?, updated_at = datetime('now') WHERE id = ?")
    .run(name, description || "", JSON.stringify(questions), isPracticeBank ? 1 : 0, req.params.id);
  const row = db.prepare("SELECT * FROM quiz_sets WHERE id = ?").get(req.params.id);
  res.json(serializeSet(row));
});

router.delete("/quiz-sets/:id", (req, res) => {
  const existing = db.prepare("SELECT id FROM quiz_sets WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Quiz set not found." });
  db.prepare("DELETE FROM quiz_sets WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// --- assignments (quiz set -> class) ---

router.get("/quiz-assignments", (req, res) => {
  const rows = db.prepare(
    `SELECT qa.*, qs.name AS quiz_name FROM quiz_assignments qa
     JOIN quiz_sets qs ON qs.id = qa.quiz_set_id ORDER BY qa.created_at DESC`
  ).all();
  res.json(rows.map((r) => ({
    id: r.id,
    quizSetId: r.quiz_set_id,
    quizName: r.quiz_name,
    yearGroup: r.year_group || "",
    classGroup: r.class_group || "",
    dueAt: r.due_at,
    createdAt: r.created_at,
  })));
});

router.post("/quiz-assignments", (req, res) => {
  const { quizSetId, yearGroup, classGroup, dueAt } = req.body || {};
  const set = db.prepare("SELECT id FROM quiz_sets WHERE id = ?").get(quizSetId);
  if (!set) return res.status(400).json({ error: "Invalid quizSetId." });
  if (!yearGroup && !classGroup) {
    return res.status(400).json({ error: "At least one of yearGroup or classGroup is required." });
  }
  const info = db
    .prepare("INSERT INTO quiz_assignments (quiz_set_id, year_group, class_group, due_at) VALUES (?, ?, ?, ?)")
    .run(quizSetId, yearGroup || "", classGroup || "", dueAt || null);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.delete("/quiz-assignments/:id", (req, res) => {
  db.prepare("DELETE FROM quiz_assignments WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
