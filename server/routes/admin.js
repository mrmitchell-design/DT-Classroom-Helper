const express = require("express");
const db = require("../db");
const { requireAdmin, hashPassword, generateTempPassword } = require("../auth");
const { parseCSV } = require("../csv");

const router = express.Router();
router.use(requireAdmin);

const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;

// shared by both the single-add form and the CSV bulk importer
function createStudentRow({ username, displayName, classGroup, yearGroup, password }) {
  if (!username || !displayName) {
    return { ok: false, error: "username and displayName are required." };
  }
  const cleanUsername = String(username).trim().toLowerCase().replace(/\s+/g, "");
  if (!USERNAME_RE.test(cleanUsername)) {
    return { ok: false, error: "Username must be 3-32 characters: letters, numbers, dots, dashes or underscores only.", username: cleanUsername };
  }
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(cleanUsername);
  if (existing) return { ok: false, error: "That username is already taken.", username: cleanUsername };

  const finalPassword = password && password.length >= 6 ? password : generateTempPassword();
  const hash = hashPassword(finalPassword);
  const info = db
    .prepare("INSERT INTO users (username, password_hash, display_name, role, class_group, year_group) VALUES (?, ?, ?, 'student', ?, ?)")
    .run(cleanUsername, hash, displayName, classGroup || "", yearGroup || "");
  return {
    ok: true,
    id: info.lastInsertRowid,
    username: cleanUsername,
    displayName,
    classGroup: classGroup || "",
    yearGroup: yearGroup || "",
    temporaryPassword: finalPassword,
  };
}

// list students with quick stats
router.get("/users", (req, res) => {
  const rows = db
    .prepare(
      `SELECT u.id, u.username, u.display_name, u.class_group, u.year_group, u.created_at,
              (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id) AS submission_count,
              (SELECT COUNT(*) FROM quiz_attempts q WHERE q.user_id = u.id) AS quiz_count,
              (SELECT MAX(taken_at) FROM quiz_attempts q WHERE q.user_id = u.id) AS last_quiz_at,
              (SELECT MAX(updated_at) FROM submissions s WHERE s.user_id = u.id) AS last_work_at,
              (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id AND s.marked_complete = 0) +
              (SELECT COUNT(*) FROM quiz_attempts q WHERE q.user_id = u.id AND q.marked_complete = 0) AS needs_marking_count
       FROM users u WHERE u.role = 'student' ORDER BY u.year_group, u.class_group, u.display_name`
    )
    .all();
  res.json(
    rows.map((r) => ({
      id: r.id,
      username: r.username,
      displayName: r.display_name,
      classGroup: r.class_group,
      yearGroup: r.year_group,
      createdAt: r.created_at,
      submissionCount: r.submission_count,
      quizCount: r.quiz_count,
      lastQuizAt: r.last_quiz_at,
      lastWorkAt: r.last_work_at,
      needsMarkingCount: r.needs_marking_count,
    }))
  );
});

// create a student account. If password omitted, a temp password is generated and returned once.
router.post("/users", (req, res) => {
  const result = createStudentRow(req.body || {});
  if (!result.ok) return res.status(result.error.includes("taken") ? 409 : 400).json({ error: result.error });
  res.status(201).json(result);
});

// downloadable CSV template
router.get("/users/import-template.csv", (req, res) => {
  const csv = "username,displayName,yearGroup,classGroup,password\njsmith,Jamie Smith,Year 9,9A,\nabrown,Alex Brown,Year 9,9A,mypassword123\n";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="student-import-template.csv"');
  res.send(csv);
});

// bulk import students from CSV text. Expected header row (case-insensitive,
// any order): username, displayName, yearGroup, classGroup, password
// (password column is optional; per-row password is also optional).
router.post("/users/import-csv", (req, res) => {
  const { csv } = req.body || {};
  if (!csv || typeof csv !== "string") return res.status(400).json({ error: "csv text is required." });

  const rows = parseCSV(csv);
  if (rows.length < 2) return res.status(400).json({ error: "CSV needs a header row and at least one data row." });

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name) => header.indexOf(name.toLowerCase());
  const idx = {
    username: col("username"),
    displayName: col("displayname"),
    yearGroup: col("yeargroup"),
    classGroup: col("classgroup"),
    password: col("password"),
  };
  if (idx.username === -1 || idx.displayName === -1) {
    return res.status(400).json({ error: 'CSV header must include at least "username" and "displayName" columns.' });
  }

  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rowNum = i + 1; // 1-indexed, matches what a spreadsheet would show
    const username = idx.username >= 0 ? (r[idx.username] || "").trim() : "";
    const displayName = idx.displayName >= 0 ? (r[idx.displayName] || "").trim() : "";
    const yearGroup = idx.yearGroup >= 0 ? (r[idx.yearGroup] || "").trim() : "";
    const classGroup = idx.classGroup >= 0 ? (r[idx.classGroup] || "").trim() : "";
    const password = idx.password >= 0 ? (r[idx.password] || "").trim() : "";

    if (!username && !displayName) continue; // skip fully blank rows

    const result = createStudentRow({ username, displayName, classGroup, yearGroup, password });
    results.push({ row: rowNum, ...result });
  }

  const created = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  res.json({
    createdCount: created.length,
    failedCount: failed.length,
    created: created.map((r) => ({ username: r.username, displayName: r.displayName, temporaryPassword: r.temporaryPassword })),
    failed: failed.map((r) => ({ row: r.row, username: r.username, error: r.error })),
  });
});

// edit a student's details - display name, class, year. Moving a student
// between classes/years is just an update to these two columns; their
// submissions and quiz_attempts are linked by user_id and are completely
// unaffected, so no work is ever lost when reorganising.
router.patch("/users/:id", (req, res) => {
  const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(req.params.id);
  if (!user || user.role !== "student") return res.status(404).json({ error: "Student not found." });
  const { displayName, classGroup, yearGroup } = req.body || {};
  const current = db.prepare("SELECT display_name, class_group, year_group FROM users WHERE id = ?").get(req.params.id);
  db.prepare("UPDATE users SET display_name = ?, class_group = ?, year_group = ? WHERE id = ?").run(
    displayName !== undefined ? displayName : current.display_name,
    classGroup !== undefined ? classGroup : current.class_group,
    yearGroup !== undefined ? yearGroup : current.year_group,
    req.params.id
  );
  const updated = db.prepare("SELECT id, username, display_name, class_group, year_group FROM users WHERE id = ?").get(req.params.id);
  res.json({
    id: updated.id,
    username: updated.username,
    displayName: updated.display_name,
    classGroup: updated.class_group,
    yearGroup: updated.year_group,
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

// view a student's saved worksheets (includes feedback)
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
      feedback: r.feedback || "",
      markedComplete: !!r.marked_complete,
      taskId: r.task_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))
  );
});

// set/update feedback on a worksheet submission
router.put("/submissions/:id/feedback", (req, res) => {
  const sub = db.prepare("SELECT id FROM submissions WHERE id = ?").get(req.params.id);
  if (!sub) return res.status(404).json({ error: "Submission not found." });
  const { feedback } = req.body || {};
  db.prepare("UPDATE submissions SET feedback = ? WHERE id = ?").run(feedback || "", req.params.id);
  res.json({ ok: true });
});

// mark/unmark a worksheet submission as complete (reviewed by the teacher)
router.patch("/submissions/:id/mark-complete", (req, res) => {
  const sub = db.prepare("SELECT id FROM submissions WHERE id = ?").get(req.params.id);
  if (!sub) return res.status(404).json({ error: "Submission not found." });
  const { complete } = req.body || {};
  db.prepare("UPDATE submissions SET marked_complete = ? WHERE id = ?").run(complete ? 1 : 0, req.params.id);
  res.json({ ok: true, markedComplete: !!complete });
});

// view a student's quiz history (summary - use /quiz-attempts/:id for full Q&A detail)
router.get("/users/:id/quiz-attempts", (req, res) => {
  const rows = db.prepare("SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY taken_at DESC").all(req.params.id);
  res.json(
    rows.map((r) => ({
      id: r.id,
      quizSet: r.quiz_set,
      difficulty: r.difficulty,
      score: r.score,
      total: r.total,
      durationSeconds: r.duration_seconds,
      feedback: r.feedback || "",
      markedComplete: !!r.marked_complete,
      quizSetId: r.quiz_set_id,
      takenAt: r.taken_at,
    }))
  );
});

// full detail for one quiz attempt: every question, the student's answer,
// the correct answer, and whether it was marked correct (including any
// manual admin override) - what the review/override UI is built on.
router.get("/quiz-attempts/:id", (req, res) => {
  const row = db.prepare("SELECT qa.*, u.display_name, u.username FROM quiz_attempts qa JOIN users u ON u.id = qa.user_id WHERE qa.id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Quiz attempt not found." });
  res.json({
    id: row.id,
    userId: row.user_id,
    studentName: row.display_name,
    studentUsername: row.username,
    quizSet: row.quiz_set,
    difficulty: row.difficulty,
    score: row.score,
    total: row.total,
    durationSeconds: row.duration_seconds,
    feedback: row.feedback || "",
    markedComplete: !!row.marked_complete,
    details: JSON.parse(row.details || "[]"),
    takenAt: row.taken_at,
  });
});

// manually override whether a specific question in an attempt was correct,
// then recompute the attempt's overall score to match.
router.patch("/quiz-attempts/:id/override", (req, res) => {
  const row = db.prepare("SELECT * FROM quiz_attempts WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Quiz attempt not found." });
  const { qid, isCorrect } = req.body || {};
  if (!qid || typeof isCorrect !== "boolean") {
    return res.status(400).json({ error: "qid and isCorrect (boolean) are required." });
  }
  const details = JSON.parse(row.details || "[]");
  const idx = details.findIndex((d) => d.qid === qid);
  if (idx === -1) return res.status(404).json({ error: "Question not found in this attempt." });
  details[idx].isCorrect = isCorrect;
  details[idx].overridden = true;
  const newScore = details.filter((d) => d.isCorrect).length;
  db.prepare("UPDATE quiz_attempts SET details = ?, score = ? WHERE id = ?").run(JSON.stringify(details), newScore, req.params.id);
  res.json({ id: row.id, score: newScore, total: row.total, details });
});

// set/update feedback on a quiz attempt
router.put("/quiz-attempts/:id/feedback", (req, res) => {
  const row = db.prepare("SELECT id FROM quiz_attempts WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Quiz attempt not found." });
  const { feedback } = req.body || {};
  db.prepare("UPDATE quiz_attempts SET feedback = ? WHERE id = ?").run(feedback || "", req.params.id);
  res.json({ ok: true });
});

// mark/unmark a quiz attempt as complete (reviewed by the teacher)
router.patch("/quiz-attempts/:id/mark-complete", (req, res) => {
  const row = db.prepare("SELECT id FROM quiz_attempts WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Quiz attempt not found." });
  const { complete } = req.body || {};
  db.prepare("UPDATE quiz_attempts SET marked_complete = ? WHERE id = ?").run(complete ? 1 : 0, req.params.id);
  res.json({ ok: true, markedComplete: !!complete });
});

// Gradebook for one class: every student in that class/year, every quiz or
// task assigned to them, and how they did - plus a class average per item.
// "Needs marking" anywhere in the app means marked_complete = 0, i.e.
// nothing the teacher hasn't explicitly reviewed yet.
router.get("/gradebook", (req, res) => {
  const yearGroup = req.query.yearGroup || "";
  const classGroup = req.query.classGroup || "";
  if (!yearGroup && !classGroup) {
    return res.status(400).json({ error: "yearGroup and/or classGroup query params are required." });
  }

  const students = db
    .prepare(
      `SELECT id, username, display_name FROM users
       WHERE role = 'student' AND (? = '' OR year_group = ?) AND (? = '' OR class_group = ?)
       ORDER BY display_name`
    )
    .all(yearGroup, yearGroup, classGroup, classGroup);
  const studentIds = students.map((s) => s.id);

  const quizAssignments = db
    .prepare(
      `SELECT qa.*, qs.name AS quiz_name FROM quiz_assignments qa
       JOIN quiz_sets qs ON qs.id = qa.quiz_set_id
       WHERE (qa.year_group = '' OR qa.year_group = ?) AND (qa.class_group = '' OR qa.class_group = ?)`
    )
    .all(yearGroup, classGroup);

  const taskAssignments = db
    .prepare(
      `SELECT ta.*, wt.title AS task_title FROM task_assignments ta
       JOIN worksheet_tasks wt ON wt.id = ta.task_id
       WHERE (ta.year_group = '' OR ta.year_group = ?) AND (ta.class_group = '' OR ta.class_group = ?)`
    )
    .all(yearGroup, classGroup);

  const quizCells = {}; // studentId -> quizSetId -> {attemptId, score, total, markedComplete}
  const taskCells = {}; // studentId -> taskId -> {submissionId, markedComplete, feedback}

  if (studentIds.length > 0) {
    const placeholders = studentIds.map(() => "?").join(",");

    const attempts = db
      .prepare(`SELECT * FROM quiz_attempts WHERE user_id IN (${placeholders}) AND quiz_set_id IS NOT NULL ORDER BY taken_at DESC`)
      .all(...studentIds);
    attempts.forEach((a) => {
      quizCells[a.user_id] = quizCells[a.user_id] || {};
      if (!quizCells[a.user_id][a.quiz_set_id]) {
        quizCells[a.user_id][a.quiz_set_id] = { attemptId: a.id, score: a.score, total: a.total, markedComplete: !!a.marked_complete };
      }
    });

    const subs = db
      .prepare(`SELECT * FROM submissions WHERE user_id IN (${placeholders}) AND task_id IS NOT NULL ORDER BY updated_at DESC`)
      .all(...studentIds);
    subs.forEach((s) => {
      taskCells[s.user_id] = taskCells[s.user_id] || {};
      if (!taskCells[s.user_id][s.task_id]) {
        taskCells[s.user_id][s.task_id] = { submissionId: s.id, markedComplete: !!s.marked_complete, hasFeedback: !!s.feedback };
      }
    });
  }

  const quizAverages = {};
  quizAssignments.forEach((qa) => {
    const scores = students
      .map((s) => quizCells[s.id] && quizCells[s.id][qa.quiz_set_id])
      .filter(Boolean)
      .map((c) => (c.total > 0 ? (c.score / c.total) * 100 : 0));
    quizAverages[qa.quiz_set_id] = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  });

  res.json({
    students: students.map((s) => ({ id: s.id, username: s.username, displayName: s.display_name })),
    quizItems: quizAssignments.map((qa) => ({ assignmentId: qa.id, quizSetId: qa.quiz_set_id, name: qa.quiz_name, dueAt: qa.due_at })),
    taskItems: taskAssignments.map((ta) => ({ assignmentId: ta.id, taskId: ta.task_id, title: ta.task_title, dueAt: ta.due_at })),
    quizCells,
    taskCells,
    quizAverages,
  });
});

// export everything as one CSV (submissions + quiz scores combined, one row per record)
router.get("/export.csv", (req, res) => {
  const students = db.prepare("SELECT id, username, display_name, class_group, year_group FROM users WHERE role = 'student'").all();
  const byId = Object.fromEntries(students.map((s) => [s.id, s]));

  const submissions = db.prepare("SELECT * FROM submissions ORDER BY user_id, updated_at").all();
  const quizzes = db.prepare("SELECT * FROM quiz_attempts ORDER BY user_id, taken_at").all();

  function csvEscape(val) {
    const s = val === null || val === undefined ? "" : String(val);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  const lines = [
    ["record_type", "username", "display_name", "year_group", "class_group", "tool_mode_or_quiz_set", "framework_or_difficulty", "product_name", "score_or_answers", "total", "feedback", "date"].join(","),
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
        student.year_group || "",
        student.class_group || "",
        s.tool_mode,
        s.framework,
        s.product_name || "",
        answersFlat,
        "",
        s.feedback || "",
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
        student.year_group || "",
        student.class_group || "",
        q.quiz_set,
        q.difficulty,
        "",
        q.score,
        q.total,
        q.feedback || "",
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
