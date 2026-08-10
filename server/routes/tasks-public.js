const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

function availableTasksForUser(userId) {
  const user = db.prepare("SELECT class_group, year_group FROM users WHERE id = ?").get(userId) || {};
  const rows = db.prepare(
    `SELECT DISTINCT wt.*,
            (SELECT ta.due_at FROM task_assignments ta
             WHERE ta.task_id = wt.id
               AND (ta.class_group = '' OR ta.class_group = ?)
               AND (ta.year_group = '' OR ta.year_group = ?)
             ORDER BY ta.due_at IS NULL, ta.due_at ASC LIMIT 1) AS due_at
     FROM worksheet_tasks wt
     LEFT JOIN task_assignments ta ON ta.task_id = wt.id
     WHERE wt.is_practice_bank = 1
        OR (ta.id IS NOT NULL AND
            (ta.class_group = '' OR ta.class_group = ?) AND
            (ta.year_group = '' OR ta.year_group = ?))
     ORDER BY wt.updated_at DESC`
  ).all(user.class_group || "", user.year_group || "", user.class_group || "", user.year_group || "");

  const assignedIds = new Set(
    db.prepare(
      `SELECT DISTINCT ta.task_id FROM task_assignments ta
       WHERE (ta.class_group = '' OR ta.class_group = ?) AND (ta.year_group = '' OR ta.year_group = ?)`
    ).all(user.class_group || "", user.year_group || "").map((r) => r.task_id)
  );
  const completedIds = new Set(
    db.prepare("SELECT DISTINCT task_id FROM submissions WHERE user_id = ? AND task_id IS NOT NULL AND status = 'submitted'").all(userId).map((r) => r.task_id)
  );

  return rows.map((r) => ({
    ...r,
    is_assigned: assignedIds.has(r.id),
    is_completed: completedIds.has(r.id),
  }));
}

router.get("/available", (req, res) => {
  const rows = availableTasksForUser(req.session.userId);
  res.json(rows.map((r) => ({
    id: r.id,
    title: r.title,
    taskType: r.task_type,
    framework: r.framework,
    instructions: r.instructions || "",
    imageUrl: r.image_path ? `/uploads/${r.image_path}` : null,
    isPracticeBank: !!r.is_practice_bank,
    isAssigned: r.is_assigned,
    isCompleted: r.is_completed,
    dueAt: r.due_at,
  })));
});

router.get("/:id", (req, res) => {
  const available = availableTasksForUser(req.session.userId);
  const row = available.find((r) => String(r.id) === String(req.params.id));
  if (!row) return res.status(404).json({ error: "Task not found or not available to you." });
  res.json({
    id: row.id,
    title: row.title,
    taskType: row.task_type,
    framework: row.framework,
    instructions: row.instructions || "",
    imageUrl: row.image_path ? `/uploads/${row.image_path}` : null,
    dueAt: row.due_at,
  });
});

module.exports = router;
