const express = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

function getMyClassYear(userId) {
  return db.prepare("SELECT class_group, year_group FROM users WHERE id = ?").get(userId);
}

// A quiz set is available to a student if: it's marked as a practice bank
// (open to everyone), OR it has an assignment matching the student's current
// class/year. Assignment matching uses whatever the student's class/year is
// *right now* - if they're moved to a different class later, assignments
// for their old class naturally stop applying, same as everything else here.
function availableSetsForUser(userId) {
  const { class_group, year_group } = getMyClassYear(userId) || {};
  const rows = db.prepare(
    `SELECT DISTINCT qs.* FROM quiz_sets qs
     LEFT JOIN quiz_assignments qa ON qa.quiz_set_id = qs.id
     WHERE qs.is_practice_bank = 1
        OR (qa.id IS NOT NULL AND
            (qa.class_group = '' OR qa.class_group = ?) AND
            (qa.year_group = '' OR qa.year_group = ?))
     ORDER BY qs.updated_at DESC`
  ).all(class_group || "", year_group || "");
  return rows;
}

router.get("/available", (req, res) => {
  const rows = availableSetsForUser(req.session.userId);
  res.json(rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description || "",
    isPracticeBank: !!r.is_practice_bank,
    questionCount: JSON.parse(r.questions || "[]").length,
  })));
});

router.get("/:id", (req, res) => {
  const available = availableSetsForUser(req.session.userId);
  const row = available.find((r) => String(r.id) === String(req.params.id));
  if (!row) return res.status(404).json({ error: "Quiz not found or not available to you." });
  res.json({
    id: row.id,
    name: row.name,
    description: row.description || "",
    questions: JSON.parse(row.questions || "[]"),
  });
});

module.exports = router;
