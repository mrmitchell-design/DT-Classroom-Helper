require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const SqliteStoreFactory = require("better-sqlite3-session-store");
const SqliteStore = SqliteStoreFactory(session);

const db = require("./db"); // ensures schema + admin bootstrap run first
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submissions");
const quizRoutes = require("./routes/quiz");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const SESSION_SECRET = process.env.SESSION_SECRET || "please-change-this-secret-in-production";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true"; // set true only if served over HTTPS

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

app.use(
  session({
    store: new SqliteStore({ client: db, expired: { clear: true, intervalMs: 1000 * 60 * 60 } }),
    name: "dt_toolkit_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  })
);

app.use("/api", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/quiz-attempts", quizRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

// SPA fallback for any non-API GET route
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`DT Toolkit server running on port ${PORT}`);
});
