require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const SqliteStoreFactory = require("better-sqlite3-session-store");
const SqliteStore = SqliteStoreFactory(session);

const { SESSION_COOKIE_NAME } = require("./config");

const NODE_ENV = process.env.NODE_ENV || "development";

// Fail fast (before touching the database or starting anything) if this is a
// production boot without real security config. A missing ADMIN_PASSWORD or
// SESSION_SECRET should never silently fall back to a weak default in
// production - better to refuse to start with a clear message than to run
// insecurely.
if (NODE_ENV === "production") {
  const problems = [];
  if (!process.env.ADMIN_PASSWORD) {
    problems.push("ADMIN_PASSWORD is not set.");
  }
  if (!process.env.SESSION_SECRET) {
    problems.push("SESSION_SECRET is not set.");
  } else if (process.env.SESSION_SECRET.length < 32) {
    problems.push(`SESSION_SECRET is only ${process.env.SESSION_SECRET.length} characters - use at least 32 (try: openssl rand -hex 32).`);
  }
  if (problems.length > 0) {
    console.error("\nRefusing to start in production with insecure configuration:\n");
    problems.forEach((p) => console.error("  - " + p));
    console.error("\nSet these in your .env file (copy .env.example to .env if you haven't).\n");
    process.exit(1);
  }
}

const db = require("./db"); // ensures schema + admin bootstrap run first
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submissions");
const quizRoutes = require("./routes/quiz");
const adminRoutes = require("./routes/admin");
const quizSetsAdminRoutes = require("./routes/quizsets");
const quizSetsPublicRoutes = require("./routes/quizsets-public");
const tasksAdminRoutes = require("./routes/tasks");
const tasksPublicRoutes = require("./routes/tasks-public");
const specRoutes = require("./routes/specs");
const dtfRoutes = require("./routes/dtf");
const vocabRoutes = require("./routes/vocab");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const SESSION_SECRET = process.env.SESSION_SECRET || "please-change-this-secret-in-production";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true"; // set true only if served over HTTPS

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

// Health check - intentionally registered before session/auth middleware
// effects matter, and requires no authentication. Used by the Docker Compose
// healthcheck (and anything else that wants a cheap liveness probe).
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(
  session({
    store: new SqliteStore({ client: db, expired: { clear: true, intervalMs: 1000 * 60 * 60 } }),
    name: SESSION_COOKIE_NAME,
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
app.use("/api/admin", quizSetsAdminRoutes);
app.use("/api/admin", tasksAdminRoutes);
app.use("/api/quiz-sets", quizSetsPublicRoutes);
app.use("/api/tasks", tasksPublicRoutes);
app.use("/api/specs", specRoutes);
app.use("/api/dtf", dtfRoutes);
app.use("/api/vocab", vocabRoutes);

// uploaded task images - served statically, no auth (images are shown inline
// in the worksheet task UI; they're not sensitive, just product photos)
app.use("/uploads", express.static(path.join(DATA_DIR, "uploads")));

app.use(express.static(path.join(__dirname, "..", "public")));

// SPA fallback for any non-API GET route
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`DT Classroom Helper server running on port ${PORT}`);
});

// Graceful shutdown: stop accepting new connections, close the DB cleanly,
// then exit. Matters most when Docker stops or updates the container (it
// sends SIGTERM and waits a grace period before force-killing).
let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    try {
      db.close();
      console.log("Database closed.");
    } catch (e) {
      console.error("Error closing database:", e.message);
    }
    console.log("Shutdown complete.");
    process.exit(0);
  });
  // Safety net: if something hangs (e.g. a stuck connection), don't let the
  // container sit there forever waiting - force exit after a short grace period.
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
