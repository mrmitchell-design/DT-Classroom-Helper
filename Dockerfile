# ---- stage 1: build the frontend bundle (JS/CSS) and vendor static assets ----
FROM node:20-bookworm-slim AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts is fine here: this stage only needs devDependencies
# (babel, react, lucide-static) to run build.js. better-sqlite3 is never
# imported by the build script, so it doesn't matter whether its native
# binding actually works in this stage.
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- stage 2: compile native dependencies for THIS exact runtime image ----
# better-sqlite3 links against Node's internal V8/C++ API rather than the
# stable N-API, so a binary built for one Node build isn't guaranteed to be
# safe in another - loading a mismatched one doesn't always fail cleanly,
# it can segfault the moment real native code runs (e.g. opening a database).
FROM node:20-bookworm-slim AS deps-build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
# Install without scripts first, then EXPLICITLY force better-sqlite3 to
# recompile from source. Relying on npm's implicit "auto node-gyp rebuild for
# packages with a binding.gyp" behavior turned out to be unreliable in
# practice - it silently kept using the bundled prebuilt binary instead of
# actually compiling, which is what caused the SIGSEGV (exit 139) even after
# switching away from --ignore-scripts. `npm rebuild --build-from-source` is
# the explicit, unambiguous way to force this regardless of any implicit
# npm/package heuristics.
RUN npm ci --omit=dev --ignore-scripts
RUN npm rebuild better-sqlite3 --build-from-source --foreground-scripts

# Build-time smoke test: actually open a database and touch WAL mode, the
# exact operations that were segfaulting before. If the compiled binary is
# wrong for this environment, this fails the BUILD loudly right here, instead
# of shipping a broken image that only crashes later when the container starts.
RUN node -e "\
  const Database = require('better-sqlite3'); \
  const db = new Database('/tmp/build-verify.db'); \
  db.pragma('journal_mode = WAL'); \
  db.exec('CREATE TABLE t (x INTEGER)'); \
  db.prepare('INSERT INTO t VALUES (1)').run(); \
  const row = db.prepare('SELECT * FROM t').get(); \
  if (!row || row.x !== 1) { throw new Error('unexpected row: ' + JSON.stringify(row)); } \
  console.log('better-sqlite3 native binding verified OK'); \
  "

# ---- stage 3: lean production image (no compiler toolchain included) ----
FROM node:20-bookworm-slim
WORKDIR /app

COPY package.json ./
COPY --from=deps-build /app/node_modules ./node_modules
COPY server ./server
COPY --from=frontend-build /app/public ./public

ENV NODE_ENV=production
ENV DATA_DIR=/app/data
ENV PORT=3000
EXPOSE 3000

VOLUME ["/app/data"]

CMD ["node", "server/index.js"]
