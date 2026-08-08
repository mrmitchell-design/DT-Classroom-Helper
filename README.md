# The Design Bench — ACCESSFM & SCAMPER Toolkit (server edition)

A self-hosted web app for teaching ACCESSFM and SCAMPER, with student logins,
saved work, difficulty-tiered quizzes, and an admin console for managing
accounts and reviewing student work.

## What's inside

- **Backend**: Node.js + Express + SQLite (one file database — easy to back up)
- **Frontend**: plain JS compiled ahead of time from React/JSX (no build step needed at runtime; everything, including icons and React itself, is served locally — works fully offline once loaded)
- **Auth**: username/password, hashed with bcrypt, session cookies. Students cannot self-register — accounts are created by the admin.

## Quick start on your Zima server (CasaOS)

1. Copy this whole folder onto your Zima server (e.g. via the CasaOS file manager, `scp`, or a Git clone).
2. Open `docker-compose.yml` and change:
   - `ADMIN_PASSWORD` — the password for your admin account (username defaults to `admin`)
   - `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
3. In CasaOS, use **Custom Install → Install a docker-compose.yml** and point it at this folder, or from a terminal on the server:
   ```bash
   docker compose up -d --build
   ```
4. Visit `http://<your-zima-ip>:8080` and log in with your admin account.

### "Failed to pull image: repository does not exist"

Some app-store-style importers (ZimaOS's included) try to `docker pull` the
image named in `docker-compose.yml` before building it — but
`dt-toolkit-server` isn't a published image anywhere, it only exists once you
build it locally from the included `Dockerfile`. The `docker-compose.yml`
already includes `pull_policy: build` to tell Compose "always build locally,
never pull," which fixes this for standard `docker compose` and most
importers.

If your version of the ZimaOS app-store importer still tries to pull anyway
(some GUI importers have limited support for newer Compose fields), the
reliable fix is to build the image yourself first, so it already exists
locally before you import:

1. Open a terminal on the Zima server (SSH, or ZimaOS's built-in terminal app).
2. `cd` into this folder (wherever you copied/cloned it).
3. Run:
   ```bash
   docker compose build
   ```
4. Now import/install via the ZimaOS App Store as normal (or just run
   `docker compose up -d` from the same terminal) — the image already exists
   locally, so nothing needs to be pulled.

### Container builds fine but crashes on start (exit code 139 / segfault)

This was a real bug in an earlier version of this Dockerfile, now fixed —
worth explaining in case you rebuild from an older copy or hit something
similar with a different native dependency later.

**What was happening:** `better-sqlite3` (the database library) compiles a
native binary that talks directly to Node's internal V8/C++ API, which
changes between Node versions. A binary built for one Node build isn't
guaranteed to work in another — and unlike a clean, catchable error, loading
a mismatched native binary can segfault the whole process the moment it's
actually used (e.g. the first time a database is opened), even though
`require()` on the module succeeds.

The earlier Dockerfile installed dependencies with `npm install
--ignore-scripts`, which skips `better-sqlite3`'s own version-matching logic
and just uses whichever binary happened to ship in the npm package — fine on
some Node versions, silently broken on others (specifically Node 20 in this
case).

**The fix**, already applied in this repo: the Dockerfile now **explicitly**
forces `better-sqlite3` to recompile from source with `npm rebuild
better-sqlite3 --build-from-source`, in a dedicated build stage using the
same Node version as the final image. (An earlier version of this fix relied
on npm's *implicit* default behavior of auto-compiling packages with a
`binding.gyp` file — that turned out to be unreliable in practice and could
silently keep using the bundled prebuilt binary instead of actually
compiling, so the explicit command is what actually matters here.) That
compile stage's tools (Python, make, g++) are discarded afterward — they
never end up in the image you actually run, so it stays just as lean.

The build also now includes a **smoke test**: right after compiling, it
opens a real database and exercises WAL mode inside the build itself — the
exact operations that were segfaulting before. If the compiled binary is
ever wrong for the target environment again, `docker compose build` will
fail immediately with a clear error, instead of producing a broken image
that only reveals the problem later as a crash-loop.

One practical consequence: `docker compose build` will take noticeably
longer than before (the native module is genuinely being compiled now,
rather than just copied). That's expected — usually well under a minute on
typical hardware, and it only happens on build, not on every `up`.

The first time the container starts, it automatically creates the admin
account from `ADMIN_USERNAME` / `ADMIN_PASSWORD`. This only happens once —
changing those environment variables later does **not** change an existing
admin password (use the admin console, or see "Resetting the admin
password" below).

### Persisting data

All accounts, saved worksheets, and quiz history live in one SQLite file at
`./data/app.db` (mounted as a Docker volume). **Back this up regularly** —
copying that one file (and `app.db-wal` / `app.db-shm` if present, or just
stop the container first for a clean copy) is a complete backup.

## Using it

### As the teacher/admin
- Log in with your admin account to land on the **Admin Console**.
- **Add student**: creates an account and shows a one-time temporary password — write it down or share it with the student immediately, it isn't shown again (though you can always generate a new one with "Reset password").
- Click a student's row to see their saved worksheets and quiz history.
- **Export class CSV** downloads everyone's saved work and quiz scores in one spreadsheet-friendly file.

### As a student
- Log in with the username/password your teacher gave you.
- **Learn**: reference cards for every ACCESSFM/SCAMPER letter.
- **Quiz**: three difficulty tiers (Standard multiple-choice, Challenge adds scenario questions, Extension adds short typed answers marked against a model answer). Scores are saved automatically.
- **Worksheet**: design-your-own or analyse-an-existing-product modes, with optional word banks and sentence starters, a Simple English toggle, and read-aloud on every question. Work is saved to your account (see "My saved work") and can be exported as a PDF or Word document.

## Local development (without Docker)

```bash
npm install
npm run build      # compiles src/*.jsx -> public/app.js, vendors icons/React
cp .env.example .env   # then edit .env
npm start
```

The server runs on `http://localhost:3000` by default. Any time you edit a
file in `src/`, re-run `npm run build` (or `npm run build && npm start`)
to see the change — there's no live-reload dev server, this is intentionally
a simple, low-maintenance setup.

## Project structure

```
server/           Express backend (routes, auth, database)
src/               React/JSX source — edit these
public/            Compiled output + static assets (generated by build.js, don't hand-edit app.js)
data/              SQLite database lives here (gitignore this in a real repo)
Dockerfile         3-stage build: frontend assets, native deps (compiled from source), lean runtime
docker-compose.yml CasaOS/Docker deployment config
build.js           Compiles src/*.jsx -> public/app.js and vendors static assets
```

## Resetting the admin password

If you're locked out, stop the container, open the SQLite database directly,
and either delete the admin row (a new one will be created from
`ADMIN_USERNAME`/`ADMIN_PASSWORD` on next boot) or use a small Node script
with `bcryptjs` to set a new hash. Ask if you'd like a ready-made script for
this — it's a five-minute job.

## Security notes for a real deployment

- This is built for **trusted classroom/LAN use**. If you expose it beyond
  your home network, put it behind HTTPS (e.g. a reverse proxy in CasaOS with
  a certificate) and set `COOKIE_SECURE=true`.
- Change `SESSION_SECRET` and `ADMIN_PASSWORD` from the defaults before
  going live.
- Student passwords are auto-generated (e.g. `otter-42-kite`) rather than
  chosen by students, which keeps things simple and avoids weak/reused
  passwords — but it does mean you're responsible for distributing them
  securely (e.g. read aloud in class, not emailed in plaintext to a shared inbox).

## Known limitations / honest caveats

- Quiz scoring is computed client-side and just reported to the server —
  fine for a formative classroom tool, but a technically motivated student
  could tamper with their own score in the browser console. Not suitable for
  high-stakes assessment as-is.
- No password-reset self-service for students (by design — the admin resets
  passwords). No email is collected or used anywhere.
- The typed short-answer quiz questions are graded by a simple heuristic
  (answer length + keyword matching), not real language understanding —
  it's there for self-reflection against a model answer, not precise marking.

## Extending this into a larger DT app

The database schema was designed with this in mind: `submissions` and
`quiz_attempts` both have a `module` column (currently always
`"accessfm_scamper"`). A second tool can reuse the same `users` table and
login system, and just write to those tables with a different `module`
value — the admin console's per-student view would need light extension to
group by module, but the accounts, auth, and database don't need to change.
