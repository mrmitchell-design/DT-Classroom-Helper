const bcrypt = require("bcryptjs");

function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// generates a short, easy-to-read temporary password e.g. "otter-42-kite"
const WORDS = ["otter", "maple", "comet", "amber", "cedar", "coral", "birch", "flint", "ivory", "quartz", "raven", "sable", "topaz", "willow", "zephyr"];
function generateTempPassword() {
  const w1 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const w2 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const n = Math.floor(10 + Math.random() * 89);
  return `${w1}-${n}-${w2}`;
}

module.exports = { hashPassword, verifyPassword, requireAuth, requireAdmin, generateTempPassword };
