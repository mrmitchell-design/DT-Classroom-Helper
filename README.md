# DT Classroom Helper — The Design Bench (ACCESSFM & SCAMPER Toolkit)

A self-hosted web app for teaching ACCESSFM and SCAMPER, with student logins,
saved work, difficulty-tiered quizzes, and an admin console for managing
accounts and reviewing student work. This is intended as the first module of
a larger DT Classroom Helper toolset.

## What's inside

- **Backend**: Node.js + Express + SQLite (one file database — easy to back up)
- **Frontend**: plain JS compiled ahead of time from React/JSX (no build step needed at runtime; everything, including icons and React itself, is served locally — works fully offline once loaded)
- **Auth**: username/password, hashed with bcrypt, session cookies. Students cannot self-register — accounts are created by the admin.
- **Health check**: `GET /api/health` (no auth required) returns `{"status":"ok"}` — used by the Docker Compose healthcheck, and handy for any reverse proxy or uptime monitor.
- **Graceful shutdown**: the server closes its database connection cleanly on `SIGTERM`/`SIGINT`, so `docker compose stop`/container updates don't risk leaving the SQLite file in a bad state.

## ZimaOS / Docker Installation

These steps assume you're installing somewhere like
`/DATA/Apps/DT-Classroom-Helper` on your ZimaOS server, via a terminal (SSH,
or ZimaOS's built-in terminal app) rather than the App Store's GUI importer —
see the troubleshooting notes below for why.

1. Clone the repository:
   ```bash
   git clone https://github.com/mrmitchell-design/DT-Classroom-Helper.git
   cd DT-Classroom-Helper
   ```
2. Create your real config from the example file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and set a secure `ADMIN_PASSWORD` and `SESSION_SECRET`. Never
   commit `.env` to git — it's already listed in `.gitignore`. Generate a
   strong session secret with:
   ```bash
   openssl rand -hex 32
   ```
   Paste the result in as `SESSION_SECRET` in `.env`. The app will refuse to
   start in production if `SESSION_SECRET` is missing or shorter than 32
   characters, or if `ADMIN_PASSWORD` is missing — this is intentional, so a
   misconfigured deployment fails loudly instead of running insecurely.
4. Build and start:
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```
5. Check it's actually running:
   ```bash
   docker compose ps
   ```
6. If anything looks wrong, check the logs:
   ```bash
   docker compose logs -f
   ```
7. Visit `http://<your-zima-ip>:8080` and log in with your admin account
   (`ADMIN_USERNAME` from `.env`, default `admin`).

### "Failed to pull image: repository does not exist"

Some app-store-style importers (ZimaOS's included) try to `docker pull` the
image named in `docker-compose.yml` before building it — but
`dt-classroom-helper` isn't a published image anywhere, it only exists once
you build it locally from the included `Dockerfile`. The `docker-compose.yml`
already includes `pull_policy: build` to tell Compose "always build locally,
never pull," which fixes this for standard `docker compose` and most
importers. If your version of the ZimaOS GUI importer still tries to pull
anyway, build it yourself first from a terminal (`docker compose build`),
then import — the image already exists locally, so nothing needs pulling.

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

**The fix**, already applied in this repo: the Dockerfile **explicitly**
forces `better-sqlite3` to recompile from source with `npm rebuild
better-sqlite3 --build-from-source`, in a dedicated build stage using the
same Node version as the final image, then verifies it with a build-time
smoke test that actually opens a database and exercises WAL mode — the exact
operations that were segfaulting before. If the compiled binary is ever
wrong for the target environment again, `docker compose build` will fail
immediately with a clear error, instead of producing a broken image that
only reveals the problem later as a crash-loop. The compiler toolchain
(Python, make, g++) used for this is discarded afterward — it never ends up
in the image you actually run.

One practical consequence: `docker compose build` will take noticeably
longer than a plain JS-only image (the native module is genuinely being
compiled). That's expected — usually well under a minute on typical
hardware, and it only happens on build, not on every `up`.

The first time the container starts, it automatically creates the admin
account from `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env`. This only
happens once — changing `.env` later does **not** change an existing admin
password (use the admin console, or see "Resetting the admin password"
below).

### Persisting data

All accounts, saved worksheets, and quiz history live in one SQLite file at
`./data/app.db` (mounted as a Docker volume, so it survives container
rebuilds and updates). **Back this up regularly** — copying that one file
(and `app.db-wal` / `app.db-shm` if present, or just stop the container
first for a clean copy) is a complete backup.

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
docker-compose.yml ZimaOS/Docker deployment config (reads secrets from .env)
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
  your home network, put it behind HTTPS (e.g. a reverse proxy in ZimaOS with
  a certificate) and set `COOKIE_SECURE=true` in `.env`.
- `ADMIN_PASSWORD` and `SESSION_SECRET` must be set in `.env` before a
  production deploy — the app checks for this on startup and refuses to run
  with a missing or weak `SESSION_SECRET` (under 32 characters) or a missing
  `ADMIN_PASSWORD`, rather than silently falling back to an insecure default.
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
