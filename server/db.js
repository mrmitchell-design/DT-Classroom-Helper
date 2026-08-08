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
