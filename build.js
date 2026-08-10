// Compiles src/*.jsx (in dependency order) into public/app.js using classic JSX
// runtime (no external Babel needed at request time), and copies React/ReactDOM
// UMD builds plus the icon set into public/ so the app runs fully offline.
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");
const presetReact = require("@babel/preset-react");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");

const FILES_IN_ORDER = [
  "content.js",
  "icons.jsx",
  "api.jsx",
  "shared.jsx",
  "changepassword.jsx",
  "notifications.jsx",
  "quiz.jsx",
  "worksheet.jsx",
  "login.jsx",
  "studentapp.jsx",
  "admin-csvimport.jsx",
  "admin-classes.jsx",
  "admin-quizzes.jsx",
  "admin-tasks.jsx",
  "admin-gradebook.jsx",
  "admin.jsx",
  "root.jsx",
];

function buildAppJs() {
  const header = "/* global React, ReactDOM */\nconst { useState, useMemo, useRef, useEffect } = React;\n\n";
  const combined = header + FILES_IN_ORDER.map((f) => {
    const filePath = path.join(SRC, f);
    return `/* ===== ${f} ===== */\n` + fs.readFileSync(filePath, "utf8");
  }).join("\n\n");

  const out = babel.transformSync(combined, { presets: [[presetReact, { runtime: "classic" }]] });
  fs.writeFileSync(path.join(PUBLIC, "app.js"), out.code);
  console.log(`[build] wrote public/app.js (${out.code.length} bytes)`);
}

function vendorStaticAssets() {
  const vendorDir = path.join(PUBLIC, "vendor");
  const iconsDir = path.join(PUBLIC, "icons");
  fs.mkdirSync(vendorDir, { recursive: true });
  fs.mkdirSync(iconsDir, { recursive: true });

  const reactDir = path.dirname(require.resolve("react/package.json"));
  const reactDomDir = path.dirname(require.resolve("react-dom/package.json"));
  fs.copyFileSync(
    path.join(reactDir, "umd", "react.production.min.js"),
    path.join(vendorDir, "react.production.min.js")
  );
  fs.copyFileSync(
    path.join(reactDomDir, "umd", "react-dom.production.min.js"),
    path.join(vendorDir, "react-dom.production.min.js")
  );
  console.log("[build] vendored React/ReactDOM UMD builds");

  const iconPkgDir = path.dirname(require.resolve("lucide-static/package.json"));
  const iconsSrcDir = path.join(iconPkgDir, "icons");
  const needed = [
    "printer", "download", "rotate-ccw", "check", "x", "chevron-right", "wrench",
    "volume-2", "lightbulb", "chevron-down", "pen-line", "search", "palette",
    "coins", "users", "leaf", "ruler", "shield-check", "settings", "layers",
    "repeat", "git-merge", "refresh-cw", "sliders-horizontal", "recycle",
    "eraser", "arrow-left-right", "user-plus", "key", "trash-2", "file-down",
    "users-round", "clipboard-list", "log-out", "shield",
  ];
  let copied = 0;
  needed.forEach((name) => {
    const from = path.join(iconsSrcDir, `${name}.svg`);
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, path.join(iconsDir, `${name}.svg`));
      copied++;
    } else {
      console.warn(`[build] WARNING: icon not found: ${name}`);
    }
  });
  console.log(`[build] vendored ${copied}/${needed.length} icons`);
}

buildAppJs();
vendorStaticAssets();
console.log("[build] done.");
