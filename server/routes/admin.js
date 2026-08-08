const express = require("express");
const db = require("../db");
const { requireAdmin, hashPassword, generateTempPassword } = require("../auth");

const router = express.Router();
router.use(requireAdmin);

// list students with quick stats
router.get("/users", (req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.username, u.display_name, u.class_group, u.created_at,
              (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id) AS submission_count,
              (SELECT COUNT(*) FROM quiz_attempts q WHERE q.user_id = u.id) AS quiz_count,
              (SELECT MAX(taken_at) FROM quiz_attempts q WHERE q.user_id = u.id) AS last_quiz_at,
              (SELECT MAX(updated_at) FROM submissions s WHERE s.user_id = u.id) AS last_work_at
       FROM users u WHERE u.role = 'student' ORDER BY u.class_group, u.display_name`
    )
    .all();
  res.json(
    rows.map((r) => ({
      id: r.id,
      username: r.username,
      displayName: r.display_name,
      classGroup: r.class_group,
      createdAt: r.created_at,
      submissionCount: r.submission_count,
      quizCount: r.quiz_count,
      lastQuizAt: r.last_quiz_at,
      lastWorkAt: r.last_work_at,
    }))
  );
});

// create a student account. If password omitted, a temp password is generated and returned once.
router.post("/users", (req, res) => {
  const { username, displayName, classGroup, password } = req.body || {};
  if (!username || !displayName) {
    return res.status(400).json({ error: "username and displayName are required." });
  }
  const cleanUsername = String(username).trim().toLowerCase().replace(/\s+/g, "");
  if (!/^[a-z0-9._-]{3,32}$/.test(cleanUsername)) {
    return res.status(400).json({ error: "Username must be 3-32 characters: letters, numbers, dots, dashes or underscores only." });
  }
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(cleanUsername);
  if (existing) return res.status(409).json({ error: "That username is already taken." });

  const finalPassword = password && password.length >= 6 ? password : generateTempPassword();
  const hash = hashPassword(finalPassword);
  const info = db
    .prepare("INSERT INTO users (username, password_hash, display_name, role, class_group) VALUES (?, ?, ?, 'student', ?)")
    .run(cleanUsername, hash, displayName, classGroup || "");
  res.status(201).json({
    id: info.lastInsertRowid,
    username: cleanUsername,
    displayName,
    classGroup: classGroup || "",
    temporaryPassword: finalPassword,
  });
});

// reset a student's password (returns the new one once, admin must relay it)
router.post("/users/:id/reset-password", (req, res) => {
  const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(req.params.id);
  if (!user || user.role !== "student") return res.status(404).json({ error: "Student not found." });
  const { password } = req.body || {};
  const finalPassword = password && password.length >= 6 ? password : generateTempPassword();
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(finalPassword), req.params.id);
  res.json({ temporaryPassword: finalPassword });
});

router.delete("/users/:id", (req, res) => {
  const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(req.params.id);
  if (!user || user.role !== "student") return res.status(404).json({ error: "Student not found." });
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// view a student's saved worksheets
router.get("/users/:id/submissions", (req, res) => {
  const rows = db.prepare("SELECT * FROM submissions WHERE user_id = ? ORDER BY updated_at DESC").all(req.params.id);
  res.json(
    rows.map((r) => ({
      id: r.id,
      toolMode: r.tool_mode,
      framework: r.framework,
      productName: r.product_name,
      brand: r.brand,
      answers: JSON.parse(r.answers || "{}"),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))
  );
});

// view a student's quiz history
router.get("/users/:id/quiz-attempts", (req, res) => {
  const rows = db.prepare("SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY taken_at DESC").all(req.params.id);
  res.json(
    rows.map((r) => ({
      id: r.id,
      quizSet: r.quiz_set,
      difficulty: r.difficulty,
      score: r.score,
      total: r.total,
      takenAt: r.taken_at,
    }))
  );
});

// export everything as one CSV (submissions + quiz scores combined, one row per record)
router.get("/export.csv", (req, res) => {
  const students = db.prepare("SELECT id, username, display_name, class_group FROM users WHERE role = 'student'").all();
  const byId = Object.fromEntries(students.map((s) => [s.id, s]));

  const submissions = db.prepare("SELECT * FROM submissions ORDER BY user_id, updated_at").all();
  const quizzes = db.prepare("SELECT * FROM quiz_attempts ORDER BY user_id, taken_at").all();

  function csvEscape(val) {
    const s = val === null || val === undefined ? "" : String(val);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  const lines = [
    ["record_type", "username", "display_name", "class_group", "tool_mode_or_quiz_set", "framework_or_difficulty", "product_name", "score_or_answers", "total", "date"].join(","),
  ];

  submissions.forEach((s) => {
    const student = byId[s.user_id];
    if (!student) return;
    const answersFlat = Object.entries(JSON.parse(s.answers || "{}"))
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
    lines.push(
      [
        "worksheet",
        student.username,
        student.display_name,
        student.class_group || "",
        s.tool_mode,
        s.framework,
        s.product_name || "",
        answersFlat,
        "",
        s.updated_at,
      ]
        .map(csvEscape)
        .join(",")
    );
  });

  quizzes.forEach((q) => {
    const student = byId[q.user_id];
    if (!student) return;
    lines.push(
      [
        "quiz",
        student.username,
        student.display_name,
        student.class_group || "",
        q.quiz_set,
        q.difficulty,
        "",
        q.score,
        q.total,
        q.taken_at,
      ]
        .map(csvEscape)
        .join(",")
    );
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="dt-classroom-helper-export-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(lines.join("\n"));
});

module.exports = router;
