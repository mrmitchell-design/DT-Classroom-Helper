const express = require("express");
const rateLimit = require("express-rate-limit");
const db = require("../db");
const { verifyPassword } = require("../auth");
const { SESSION_COOKIE_NAME } = require("../config");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please wait a few minutes and try again." },
});

router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(String(username).trim().toLowerCase());
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  req.session.userId = user.id;
  req.session.role = user.role;
  res.json({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    role: user.role,
    classGroup: user.class_group,
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(SESSION_COOKIE_NAME);
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session || !req.session.userId) return res.json(null);
  const user = db.prepare("SELECT id, username, display_name, role, class_group FROM users WHERE id = ?").get(req.session.userId);
  if (!user) return res.json(null);
  res.json({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    role: user.role,
    classGroup: user.class_group,
  });
});

module.exports = router;
