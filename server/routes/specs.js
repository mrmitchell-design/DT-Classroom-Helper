const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

function serializeProject(row, points) {
  return {
    id: row.id,
    projectName: row.project_name,
    designProblem: row.design_problem,
    intendedUser: row.intended_user,
    status: row.status,
    submittedAt: row.submitted_at,
    feedback: row.feedback || "",
    markedComplete: !!row.marked_complete,
    summaryText: row.summary_text || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    points: points ? points.map(serializePoint) : undefined,
  };
}

function serializePoint(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    category: row.category,
    requirement: row.requirement,
    reason: row.reason,
    testingMethod: row.testing_method,
    order: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function ownProject(userId, projectId) {
  return db.prepare("SELECT * FROM spec_projects WHERE id = ? AND user_id = ?").get(projectId, userId);
}

// list own projects (summary, with a point count, for a "My specifications" list)
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.*, (SELECT COUNT(*) FROM spec_points sp WHERE sp.project_id = p.id) AS point_count
       FROM spec_projects p WHERE p.user_id = ? ORDER BY p.updated_at DESC`
    )
    .all(req.session.userId);
  res.json(rows.map((r) => ({ ...serializeProject(r), pointCount: r.point_count })));
});

router.post("/", (req, res) => {
  const { projectName, designProblem, intendedUser } = req.body || {};
  if (!projectName || !projectName.trim()) return res.status(400).json({ error: "projectName is required." });
  const info = db
    .prepare("INSERT INTO spec_projects (user_id, project_name, design_problem, intended_user) VALUES (?, ?, ?, ?)")
    .run(req.session.userId, projectName.trim(), designProblem || "", intendedUser || "");
  const row = db.prepare("SELECT * FROM spec_projects WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(serializeProject(row, []));
});

router.get("/:id", (req, res) => {
  const project = ownProject(req.session.userId, req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const points = db.prepare("SELECT * FROM spec_points WHERE project_id = ? ORDER BY category, order_index").all(project.id);
  res.json(serializeProject(project, points));
});

router.put("/:id", (req, res) => {
  const project = ownProject(req.session.userId, req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const { projectName, designProblem, intendedUser } = req.body || {};
  db.prepare(
    "UPDATE spec_projects SET project_name = ?, design_problem = ?, intended_user = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(
    projectName !== undefined ? projectName.trim() : project.project_name,
    designProblem !== undefined ? designProblem : project.design_problem,
    intendedUser !== undefined ? intendedUser : project.intended_user,
    project.id
  );
  const row = db.prepare("SELECT * FROM spec_projects WHERE id = ?").get(project.id);
  res.json(serializeProject(row));
});

router.delete("/:id", (req, res) => {
  const project = ownProject(req.session.userId, req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  db.prepare("DELETE FROM spec_projects WHERE id = ?").run(project.id);
  res.json({ ok: true });
});

// hand in - mirrors the worksheet draft/submitted pattern
router.post("/:id/hand-in", (req, res) => {
  const project = ownProject(req.session.userId, req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const submittedAt = project.submitted_at || new Date().toISOString().replace("T", " ").slice(0, 19);
  db.prepare("UPDATE spec_projects SET status = 'submitted', submitted_at = ?, updated_at = datetime('now') WHERE id = ?").run(submittedAt, project.id);
  const row = db.prepare("SELECT * FROM spec_projects WHERE id = ?").get(project.id);
  res.json(serializeProject(row));
});

// save the student's written summary draft (separate from the structured points)
router.put("/:id/summary", (req, res) => {
  const project = ownProject(req.session.userId, req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const { summaryText } = req.body || {};
  db.prepare("UPDATE spec_projects SET summary_text = ?, updated_at = datetime('now') WHERE id = ?").run(summaryText || "", project.id);
  const row = db.prepare("SELECT * FROM spec_projects WHERE id = ?").get(project.id);
  res.json(serializeProject(row));
});

// --- points ---

router.post("/:id/points", (req, res) => {
  const project = ownProject(req.session.userId, req.params.id);
  if (!project) return res.status(404).json({ error: "Not found" });
  const { category, requirement, reason, testingMethod } = req.body || {};
  if (!category || !requirement || !requirement.trim()) {
    return res.status(400).json({ error: "category and requirement are required." });
  }
  const maxOrder = db.prepare("SELECT COALESCE(MAX(order_index), -1) AS m FROM spec_points WHERE project_id = ? AND category = ?").get(project.id, category).m;
  const info = db
    .prepare("INSERT INTO spec_points (project_id, category, requirement, reason, testing_method, order_index) VALUES (?, ?, ?, ?, ?, ?)")
    .run(project.id, category, requirement.trim(), reason || "", testingMethod || "", maxOrder + 1);
  db.prepare("UPDATE spec_projects SET updated_at = datetime('now') WHERE id = ?").run(project.id);
  const row = db.prepare("SELECT * FROM spec_points WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(serializePoint(row));
});

function ownPoint(userId, projectId, pointId) {
  const project = ownProject(userId, projectId);
  if (!project) return null;
  const point = db.prepare("SELECT * FROM spec_points WHERE id = ? AND project_id = ?").get(pointId, project.id);
  return point ? { project, point } : null;
}

router.put("/:id/points/:pointId", (req, res) => {
  const found = ownPoint(req.session.userId, req.params.id, req.params.pointId);
  if (!found) return res.status(404).json({ error: "Not found" });
  const { category, requirement, reason, testingMethod } = req.body || {};
  const { point } = found;
  let newOrder = point.order_index;
  if (category !== undefined && category !== point.category) {
    // moving to a different category - land at the end of that category's list
    const maxOrder = db.prepare("SELECT COALESCE(MAX(order_index), -1) AS m FROM spec_points WHERE project_id = ? AND category = ?").get(point.project_id, category).m;
    newOrder = maxOrder + 1;
  }
  db.prepare(
    "UPDATE spec_points SET category = ?, requirement = ?, reason = ?, testing_method = ?, order_index = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(
    category !== undefined ? category : point.category,
    requirement !== undefined ? requirement.trim() : point.requirement,
    reason !== undefined ? reason : point.reason,
    testingMethod !== undefined ? testingMethod : point.testing_method,
    newOrder,
    point.id
  );
  db.prepare("UPDATE spec_projects SET updated_at = datetime('now') WHERE id = ?").run(point.project_id);
  const row = db.prepare("SELECT * FROM spec_points WHERE id = ?").get(point.id);
  res.json(serializePoint(row));
});

router.delete("/:id/points/:pointId", (req, res) => {
  const found = ownPoint(req.session.userId, req.params.id, req.params.pointId);
  if (!found) return res.status(404).json({ error: "Not found" });
  db.prepare("DELETE FROM spec_points WHERE id = ?").run(found.point.id);
  db.prepare("UPDATE spec_projects SET updated_at = datetime('now') WHERE id = ?").run(found.point.project_id);
  res.json({ ok: true });
});

// swap order_index with the neighbouring point in the same category
router.post("/:id/points/:pointId/move", (req, res) => {
  const found = ownPoint(req.session.userId, req.params.id, req.params.pointId);
  if (!found) return res.status(404).json({ error: "Not found" });
  const { direction } = req.body || {};
  if (direction !== "up" && direction !== "down") return res.status(400).json({ error: "direction must be 'up' or 'down'." });
  const { point } = found;

  const siblings = db
    .prepare("SELECT * FROM spec_points WHERE project_id = ? AND category = ? ORDER BY order_index")
    .all(point.project_id, point.category);
  const idx = siblings.findIndex((s) => s.id === point.id);
  const swapWith = direction === "up" ? siblings[idx - 1] : siblings[idx + 1];
  if (!swapWith) return res.json({ ok: true }); // already at the boundary, nothing to do

  const tx = db.transaction(() => {
    db.prepare("UPDATE spec_points SET order_index = ? WHERE id = ?").run(swapWith.order_index, point.id);
    db.prepare("UPDATE spec_points SET order_index = ? WHERE id = ?").run(point.order_index, swapWith.id);
  });
  tx();
  res.json({ ok: true });
});

module.exports = router;
