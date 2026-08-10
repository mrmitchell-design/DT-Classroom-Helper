const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

function serialize(row) {
  return {
    id: row.id,
    module: row.module,
    toolMode: row.tool_mode,
    framework: row.framework,
    productName: row.product_name,
    brand: row.brand,
    answers: JSON.parse(row.answers || "{}"),
    feedback: row.feedback || "",
    markedComplete: !!row.marked_complete,
    status: row.status,
    submittedAt: row.submitted_at,
    taskId: row.task_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// list own submissions (summary only, no full answers, for a fast "My saved work" list)
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, module, tool_mode, framework, product_name, brand, feedback, marked_complete, status, submitted_at, task_id, created_at, updated_at
       FROM submissions WHERE user_id = ? ORDER BY updated_at DESC`
    )
    .all(req.session.userId);
  res.json(
    rows.map((r) => ({
      id: r.id,
      module: r.module,
      toolMode: r.tool_mode,
      framework: r.framework,
      productName: r.product_name,
      brand: r.brand,
      feedback: r.feedback || "",
      markedComplete: !!r.marked_complete,
      status: r.status,
      submittedAt: r.submitted_at,
      taskId: r.task_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))
  );
});

// fetch one full submission (must belong to the requester)
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM submissions WHERE id = ? AND user_id = ?").get(req.params.id, req.session.userId);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(serialize(row));
});

// create new. Always starts as a draft, regardless of the DB column's own
// default (which exists only to keep pre-existing rows from a version
// before this feature looking like unfinished drafts on migration).
router.post("/", (req, res) => {
  const { module = "accessfm_scamper", toolMode, framework, productName, brand, answers, taskId } = req.body || {};
  if (!toolMode || !framework || typeof answers !== "object") {
    return res.status(400).json({ error: "toolMode, framework and answers are required." });
  }
  let taskIdVal = null;
  if (taskId !== undefined && taskId !== null) {
    const task = db.prepare("SELECT id FROM worksheet_tasks WHERE id = ?").get(taskId);
    if (task) taskIdVal = task.id;
  }
  const info = db
    .prepare(
      `INSERT INTO submissions (user_id, module, tool_mode, framework, product_name, brand, answers, task_id, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', datetime('now'))`
    )
    .run(req.session.userId, module, toolMode, framework, productName || "", brand || "", JSON.stringify(answers), taskIdVal);
  const row = db.prepare("SELECT * FROM submissions WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(serialize(row));
});

// update existing (must belong to the requester). Saving never changes
// status on its own - use POST /:id/hand-in to submit.
router.put("/:id", (req, res) => {
  const existing = db.prepare("SELECT id FROM submissions WHERE id = ? AND user_id = ?").get(req.params.id, req.session.userId);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const { productName, brand, answers } = req.body || {};
  if (typeof answers !== "object") return res.status(400).json({ error: "answers is required." });
  db.prepare(
    `UPDATE submissions SET product_name = ?, brand = ?, answers = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(productName || "", brand || "", JSON.stringify(answers), req.params.id);
  const row = db.prepare("SELECT * FROM submissions WHERE id = ?").get(req.params.id);
  res.json(serialize(row));
});

// hand in: optionally saves the latest content in the same call, then marks
// the submission as submitted (only sets submitted_at the first time - if a
// student edits and re-hands-in later, the original hand-in time is kept).
router.post("/:id/hand-in", (req, res) => {
  const existing = db.prepare("SELECT * FROM submissions WHERE id = ? AND user_id = ?").get(req.params.id, req.session.userId);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const { productName, brand, answers } = req.body || {};
  const nextProductName = answers !== undefined ? (productName || "") : existing.product_name;
  const nextBrand = answers !== undefined ? (brand || "") : existing.brand;
  const nextAnswers = answers !== undefined ? JSON.stringify(answers) : existing.answers;
  const submittedAt = existing.submitted_at || new Date().toISOString().replace("T", " ").slice(0, 19);
  db.prepare(
    `UPDATE submissions SET product_name = ?, brand = ?, answers = ?, status = 'submitted', submitted_at = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(nextProductName, nextBrand, nextAnswers, submittedAt, req.params.id);
  const row = db.prepare("SELECT * FROM submissions WHERE id = ?").get(req.params.id);
  res.json(serialize(row));
});

router.delete("/:id", (req, res) => {
  const existing = db.prepare("SELECT id FROM submissions WHERE id = ? AND user_id = ?").get(req.params.id, req.session.userId);
  if (!existing) return res.status(404).json({ error: "Not found" });
  db.prepare("DELETE FROM submissions WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
