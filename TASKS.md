# TASKS

## To do

- `PATCH /invites/:inviteId/reject` calls `accept()` — rejecting joins the workplace.
- `addProduct` auth check has `this.user.id !== this.user.id` — check never runs.
- `/users` POST returns the whole user row, including `passwordHash`.
- JWT has no `expiresIn`; `REFRESH_TOKEN_SECRET` is unused.
- Logout only clears `localStorage`, not the auth cookie.
- Router guard `requiresManager` uses `!role && !workplace` (should be `||`).
- `JobListView` routes to `myInvitations`, which does not exist.
- Frontend API files hardcode `http://localhost:3000`.
- API files read the token at module load, so the token is stale after login.
- No input validation on any backend route (no Zod / Joi).
- CORS is wide open (`app.use(cors())`).
- Controllers are called without `await` in routes.
- `Assignment` model has no routes, no controller, no UI.

## Lint problems (npx eslint src -> 101 errors, 31 warnings)

### Real bugs (small)
- `src/views/workerDash/workplace.vue:2` — broken tag `<\></h1>` stops the file from being parsed.
- 16 `no-unused-vars` — dead code, can be removed.

### Config fixes (make lint useful)
- `no-undef` (74) — ESLint does not know the browser/Node names.
  Need `languageOptions.globals` in `eslint.config.js` (console, localStorage,
  fetch, process). Without this, most errors are false alarms.
- `vue/multi-word-component-names` (9) — `Home.vue`, `invitation.vue`,
  `workplace.vue`. Rename or turn off the rule.
- `vue/attributes-order` (26) — safe to auto-fix with `--fix`.

## Doing

- (nothing)

## Done

- `fix: broken SCSS import path in SuccessView and WorkDistributionView` — build passes again.
- Installed `@eslint/js`, `eslint-plugin-vue`, `vue-eslint-parser`,
  `eslint-config-prettier` — `npx eslint src` runs now.

## Found while working

- 5 packages have blocked install scripts (npm blocked them for safety):
  `@parcel/watcher`, `@prisma/engines`, `bcrypto`, `esbuild`, `prisma`.
  The build works, but `prisma generate` may need them approved later.
- `npm audit` reports vulnerabilities (not checked in detail).