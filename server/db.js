const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "app.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  class_group TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module TEXT NOT NULL DEFAULT 'accessfm_scamper',
  tool_mode TEXT NOT NULL,
  framework TEXT NOT NULL,
  product_name TEXT,
  brand TEXT,
  answers TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module TEXT NOT NULL DEFAULT 'accessfm_scamper',
  quiz_set TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'standard',
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  taken_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_attempts(user_id);

-- A named quiz: a fully self-contained set of questions (either copied/edited
-- from the built-in question set, or written from scratch by the admin -
-- both end up as plain question objects here, so the backend never needs to
-- know about the built-in content living in the frontend bundle). Can be
-- assigned to classes, or marked as a self-serve practice quiz any student
-- can take any time.
CREATE TABLE IF NOT EXISTS quiz_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  questions TEXT NOT NULL DEFAULT '[]', -- JSON array of question objects
  is_practice_bank INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_set_id INTEGER NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
  year_group TEXT DEFAULT '',
  class_group TEXT DEFAULT '',
  due_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Admin-created worksheet tasks: a written prompt, or an uploaded image to
-- analyse with ACCESSFM/SCAMPER. Can be assigned to classes (required) or
-- marked as a practice-bank task any student can pick up any time.
CREATE TABLE IF NOT EXISTS worksheet_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'written', -- written | image
  framework TEXT NOT NULL DEFAULT 'accessfm',
  instructions TEXT,
  image_path TEXT,
  is_practice_bank INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS task_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL REFERENCES worksheet_tasks(id) ON DELETE CASCADE,
  year_group TEXT DEFAULT '',
  class_group TEXT DEFAULT '',
  due_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quiz_assignments_class ON quiz_assignments(year_group, class_group);
CREATE INDEX IF NOT EXISTS idx_task_assignments_class ON task_assignments(year_group, class_group);

-- Specification Builder. A student can have multiple projects over time
-- (like worksheets); each project holds an ordered list of spec points.
-- Points are stored as structured rows (not one text blob) specifically so
-- other future tools (Concept Generation, Decision Matrix, Final Evaluation
-- etc.) can query and reference individual requirements later.
CREATE TABLE IF NOT EXISTS spec_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL DEFAULT '',
  design_problem TEXT DEFAULT '',
  intended_user TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TEXT,
  feedback TEXT DEFAULT '',
  marked_complete INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS spec_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES spec_projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  requirement TEXT NOT NULL DEFAULT '',
  reason TEXT DEFAULT '',
  testing_method TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_spec_projects_user ON spec_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_spec_points_project ON spec_points(project_id);

-- Design Fundamentals (KS3 course). Knowledge score and DT stage are
-- deliberately separate columns everywhere - the app must never derive a
-- stage purely from a quiz percentage. "suggested" fields come from a
-- deterministic heuristic (matched against each question's stored
-- acceptedIdeas/expectedKnowledge, never a live AI call); "confirmed"/
-- teacher_* fields are the teacher's own judgement and always win when set.

CREATE TABLE IF NOT EXISTS dtf_section_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  knowledge_score REAL,
  suggested_stage TEXT,
  confirmed_stage TEXT,
  stage_reasoning TEXT DEFAULT '',
  completed_at TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, unit_key, section_key)
);

-- One row per quiz-style attempt: Micro Check, Section Check, Checkpoint,
-- End-of-Unit, or Final Challenge. The details column mirrors
-- quiz_attempts.details - a JSON array of {qid, prompt, studentAnswer,
-- correctAnswer, isCorrect} so a teacher can review and override any
-- individual question later.
CREATE TABLE IF NOT EXISTS dtf_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_key TEXT NOT NULL,
  section_key TEXT,
  attempt_type TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  details TEXT DEFAULT '[]',
  duration_seconds INTEGER,
  taken_at TEXT DEFAULT (datetime('now'))
);

-- Open/extended responses. first_response is set once and never overwritten;
-- refined_response is filled in only after the student revises following
-- feedback. suggested_* comes from the deterministic heuristic; teacher_*
-- is the override and always takes precedence when present.
CREATE TABLE IF NOT EXISTS dtf_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  first_response TEXT NOT NULL DEFAULT '',
  refined_response TEXT,
  suggested_stage TEXT,
  stage_reasoning TEXT DEFAULT '',
  teacher_feedback TEXT DEFAULT '',
  teacher_stage TEXT,
  marked_complete INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS dtf_vocab_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  term_id TEXT NOT NULL,
  familiarity TEXT NOT NULL DEFAULT 'new',
  correct_count INTEGER NOT NULL DEFAULT 0,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, term_id)
);

CREATE INDEX IF NOT EXISTS idx_dtf_progress_user ON dtf_section_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_dtf_attempts_user ON dtf_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_dtf_responses_user ON dtf_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_dtf_vocab_user ON dtf_vocab_progress(user_id);
`);

// --- lightweight migrations: add columns to existing tables if missing ---
// SQLite has no "ADD COLUMN IF NOT EXISTS", so we check pragma table_info
// first. This lets an existing deployment upgrade in place without losing
// any data - students keep their accounts, submissions and quiz history
// exactly as they are, these just add new optional fields alongside them.
function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  const exists = cols.some((c) => c.name === column);
  if (!exists) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`[migrate] Added column ${table}.${column}`);
  }
}
ensureColumn("users", "year_group", "TEXT DEFAULT ''");
ensureColumn("submissions", "feedback", "TEXT DEFAULT ''");
ensureColumn("quiz_attempts", "feedback", "TEXT DEFAULT ''");
ensureColumn("quiz_attempts", "duration_seconds", "INTEGER");
ensureColumn("quiz_attempts", "details", "TEXT DEFAULT '[]'");
ensureColumn("submissions", "marked_complete", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("quiz_attempts", "marked_complete", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("submissions", "task_id", "INTEGER REFERENCES worksheet_tasks(id)");
ensureColumn("quiz_attempts", "quiz_set_id", "INTEGER REFERENCES quiz_sets(id)");
// draft/handed-in distinction for worksheets - existing rows default to
// 'submitted' on migration (they predate this feature and were already
// being treated as finished work), new rows default to 'draft' at the
// database level so a save without an explicit status never accidentally
// counts as handed in.
ensureColumn("submissions", "status", "TEXT NOT NULL DEFAULT 'submitted'");
ensureColumn("submissions", "submitted_at", "TEXT");
ensureColumn("spec_projects", "summary_text", "TEXT DEFAULT ''");
// Resumable section progress - the whole point is that a page refresh must
// never send a student back to the start of a section they're partway
// through. session_state is a small JSON blob (current step index, plus
// anything that needs to be shown back to them later, like their Starting
// Point answer) - not a full answer log, just enough to resume cleanly.
ensureColumn("dtf_section_progress", "session_state", "TEXT DEFAULT '{}'");

db.exec(`
-- Standalone vocabulary system ("Words We Need to Work With"). Deliberately
-- separate from dtf_vocab_progress (an earlier, simpler table that was
-- never wired to any real UI) - this one tracks the richer confidence
-- model this system actually needs (four states, not three; which
-- question styles a term has been answered correctly with, since
-- "Confident" requires at least two different styles, not just repetition
-- of the same one; and an explicit "marked for practice" flag).
CREATE TABLE IF NOT EXISTS vocab_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  term_id TEXT NOT NULL,
  familiarity TEXT NOT NULL DEFAULT 'not_started',
  correct_count INTEGER NOT NULL DEFAULT 0,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  correct_styles TEXT NOT NULL DEFAULT '[]',
  marked_for_practice INTEGER NOT NULL DEFAULT 0,
  last_practised_at TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, term_id)
);

-- One row per vocabulary quiz attempt (Mixed Word Workout, category
-- practice, targeted practice) - details is a JSON array of
-- {termId, questionType, isCorrect} so teachers can see which specific
-- terms and question styles a class struggles with.
CREATE TABLE IF NOT EXISTS vocab_quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  category TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  details TEXT DEFAULT '[]',
  taken_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vocab_progress_user ON vocab_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vocab_attempts_user ON vocab_quiz_attempts(user_id);
`);


// --- one-time admin bootstrap ---
function ensureAdmin() {
  const existing = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (existing) return;
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, 'admin')"
  ).run(username, hash, "Admin");
  console.log(`[setup] Created admin account "${username}". ${process.env.ADMIN_PASSWORD ? "" : "Using default password 'changeme123' \u2014 CHANGE THIS by setting ADMIN_PASSWORD and restarting, or update it from the admin console."}`);
}
ensureAdmin();

module.exports = db;
