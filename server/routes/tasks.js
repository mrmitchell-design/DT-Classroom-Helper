const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const db = require("../db");
const { requireAdmin } = require("../auth");

const router = express.Router();
router.use(requireAdmin);

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "");
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) return cb(new Error("Only JPEG, PNG, WEBP or GIF images are allowed."));
    cb(null, true);
  },
});

function serializeTask(row) {
  return {
    id: row.id,
    title: row.title,
    taskType: row.task_type,
    framework: row.framework,
    instructions: row.instructions || "",
    imageUrl: row.image_path ? `/uploads/${row.image_path}` : null,
    isPracticeBank: !!row.is_practice_bank,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get("/tasks", (req, res) => {
  const rows = db.prepare("SELECT * FROM worksheet_tasks ORDER BY updated_at DESC").all();
  res.json(rows.map(serializeTask));
});

router.post("/tasks", upload.single("image"), (req, res) => {
  try {
    const { title, taskType, framework, instructions, isPracticeBank } = req.body || {};
    if (!title || !taskType) {
      return res.status(400).json({ error: "title and taskType are required." });
    }
    if (!["written", "image"].includes(taskType)) {
      return res.status(400).json({ error: "taskType must be 'written' or 'image'." });
    }
    if (taskType === "image" && !req.file) {
      return res.status(400).json({ error: "An image file is required for an image task." });
    }
    const imagePath = req.file ? req.file.filename : null;
    const info = db
      .prepare(
        "INSERT INTO worksheet_tasks (title, task_type, framework, instructions, image_path, is_practice_bank, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)"
      )
      .run(title, taskType, framework || "accessfm", instructions || "", imagePath, isPracticeBank === "true" || isPracticeBank === true ? 1 : 0, req.session.userId);
    const row = db.prepare("SELECT * FROM worksheet_tasks WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(serializeTask(row));
  } catch (e) {
    res.status(400).json({ error: e.message || "Could not create task." });
  }
});

router.delete("/tasks/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM worksheet_tasks WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Task not found." });
  if (row.image_path) {
    const filePath = path.join(UPLOADS_DIR, row.image_path);
    fs.unlink(filePath, () => {}); // best-effort cleanup, don't fail the request if this errors
  }
  db.prepare("DELETE FROM worksheet_tasks WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// --- assignments (task -> class) ---

router.get("/task-assignments", (req, res) => {
  const rows = db.prepare(
    `SELECT ta.*, wt.title AS task_title FROM task_assignments ta
     JOIN worksheet_tasks wt ON wt.id = ta.task_id ORDER BY ta.created_at DESC`
  ).all();
  res.json(rows.map((r) => ({
    id: r.id,
    taskId: r.task_id,
    taskTitle: r.task_title,
    yearGroup: r.year_group || "",
    classGroup: r.class_group || "",
    dueAt: r.due_at,
    createdAt: r.created_at,
  })));
});

router.post("/task-assignments", (req, res) => {
  const { taskId, yearGroup, classGroup, dueAt } = req.body || {};
  const task = db.prepare("SELECT id FROM worksheet_tasks WHERE id = ?").get(taskId);
  if (!task) return res.status(400).json({ error: "Invalid taskId." });
  if (!yearGroup && !classGroup) {
    return res.status(400).json({ error: "At least one of yearGroup or classGroup is required." });
  }
  const info = db
    .prepare("INSERT INTO task_assignments (task_id, year_group, class_group, due_at) VALUES (?, ?, ?, ?)")
    .run(taskId, yearGroup || "", classGroup || "", dueAt || null);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.delete("/task-assignments/:id", (req, res) => {
  db.prepare("DELETE FROM task_assignments WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
