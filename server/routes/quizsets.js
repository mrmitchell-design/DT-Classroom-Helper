const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../auth");
const { parseCSV } = require("../csv");

const router = express.Router();
router.use(requireAdmin);

// Parses (but does not save) a CSV of quiz questions, so the quiz builder
// can show them for review/editing before the admin commits to saving the
// quiz set. Expected header (case-insensitive, any order):
//   type,prompt,option1,option2,option3,option4,answer,badge,keywords,modelAnswer
// - type: mcq | scenario | typed
// - option1-4 and answer: used for mcq/scenario (answer must match one option)
// - keywords: comma-separated, used for typed (quote the cell if it has commas)
// - modelAnswer: used for typed
// downloadable example CSV showing the expected quiz-question format
router.get("/quiz-sets/import-template.csv", (req, res) => {
  const rows = [
    ["type", "prompt", "option1", "option2", "option3", "option4", "answer", "badge", "keywords", "modelAnswer"],
    ["mcq", "What does the letter A stand for in ACCESSFM?", "Aesthetics", "Cost", "Safety", "Function", "Aesthetics", "A", "", ""],
    ["scenario", "A kettle has rounded edges and a handle that stays cool. Which letter is this about?", "Aesthetics", "Safety", "Cost", "Function", "Safety", "S", "", ""],
    ["typed", "Explain what Cost means in ACCESSFM, in your own words.", "", "", "", "", "", "C", "cheap, affordable, price, budget", "Cost is about how much a product costs to make and to buy."],
  ];
  const csv = rows.map((r) => r.map((c) => (c.includes(",") ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n") + "\n";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="quiz-import-template.csv"');
  res.send(csv);
});

router.post("/quiz-sets/parse-csv", (req, res) => {
  const { csv } = req.body || {};
  if (!csv || typeof csv !== "string") return res.status(400).json({ error: "csv text is required." });

  const rows = parseCSV(csv);
  if (rows.length < 2) return res.status(400).json({ error: "CSV needs a header row and at least one data row." });

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name) => header.indexOf(name.toLowerCase());
  const idx = {
    type: col("type"), prompt: col("prompt"),
    option1: col("option1"), option2: col("option2"), option3: col("option3"), option4: col("option4"),
    answer: col("answer"), badge: col("badge"), keywords: col("keywords"), modelAnswer: col("modelanswer"),
  };
  if (idx.prompt === -1) {
    return res.status(400).json({ error: 'CSV header must include at least a "prompt" column.' });
  }

  const questions = [];
  const errors = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rowNum = i + 1;
    const get = (key) => (idx[key] >= 0 ? (r[idx[key]] || "").trim() : "");
    const prompt = get("prompt");
    if (!prompt) continue; // skip blank rows

    const type = ["mcq", "scenario", "typed"].includes(get("type").toLowerCase()) ? get("type").toLowerCase() : "mcq";
    const badge = get("badge") || "?";
    const qid = `csv-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`;

    if (type === "typed") {
      questions.push({
        qid, type, prompt, badge, tint: "#16324F",
        keywords: get("keywords") ? get("keywords").split(",").map((k) => k.trim()).filter(Boolean) : [],
        modelAnswer: get("modelAnswer"),
      });
    } else {
      const options = [get("option1"), get("option2"), get("option3"), get("option4")].filter(Boolean);
      const answer = get("answer");
      if (options.length < 2) {
        errors.push({ row: rowNum, error: "Needs at least 2 options for a multiple-choice/scenario question." });
        continue;
      }
      if (!answer || !options.includes(answer)) {
        errors.push({ row: rowNum, error: `Answer ("${answer}") must exactly match one of the options.` });
        continue;
      }
      questions.push({ qid, type, prompt, badge, tint: "#16324F", options, answer });
    }
  }

  res.json({ questions, errors, importedCount: questions.length, failedCount: errors.length });
});

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
