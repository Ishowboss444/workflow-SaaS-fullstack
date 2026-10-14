# TASKS

## To do

- `addProduct` auth check has `this.user.id !== this.user.id` — check never runs.
- `/users` POST returns the whole user row, including `passwordHash`.
- JWT has no `expiresIn`; `REFRESH_TOKEN_SECRET` is unused.
- Logout only clears `localStorage`, not the auth cookie.
- Router guard `requiresManager` uses `!role && !workplace` (should be `||`).
- `JobListView` routes to `myInvitations`, which does not exist.
- Frontend API files hardcode `http://localhost:3000`.
- API files read the token at module load, so the token is stale after login.
- No input validation on any backend route (no Zod / Joi).
- CORS is wide open (`app.use(cors()`).
- Controllers are called without `await` in routes.
- `Assignment` model has no routes, no controller, no UI.
- After a worker accepts an invite, the page still shows "pending" until a
  reload. Could push the user to the worker dashboard right away.

## Lint problems (npx eslint src)

### Config fixes (make lint useful)
- `no-undef` — ESLint does not know the browser/Node names (`console`,
  `localStorage`, `fetch`, `process`). Need `languageOptions.globals` in
  `eslint.config.js`. Without this, 74 false errors.
- `vue/multi-word-component-names` (9) — `Home.vue`, `invitation.vue`,
  `workplace.vue`. Rename or turn the rule off.
- `vue/attributes-order` (26) — safe to auto-fix with `npx eslint src --fix`.

## Doing

- (nothing)

## Done

- `fix: broken SCSS import path in SuccessView and WorkDistributionView` — build passes again.
- Installed `@eslint/js`, `eslint-plugin-vue`, `vue-eslint-parser`,
  `eslint-config-prettier` — `npx eslint src` runs now.
- `fix: all real ESLint problems` (0 left, ignoring 3 config-only rules):
  - broken tag `<\>` in `workerDash/workplace.vue`
  - 6 server `catch` blocks now log the error and always answer
  - `userValidationMiddleware` no longer calls `next()` after a 500
  - `FullfilledLoading` now has `v-show` so the transition can close
  - removed 7 unused imports / variables
  - added missing types to `defineModel` in 3 components
  - `invitation.vue` now shows real API data instead of 3 fake names

- `fix: invite accept/reject now really saves` (security):
  - `PATCH /invites/:inviteId/reject` called `accept()` — rejecting actually
    JOINED the workplace. Now it calls `reject()`.
  - added `acceptInvite` / `rejectInvite` in `api/invitation.ts`
  - added `acceptInvitation` / `rejectInvitation` in `useInvitationsStore`
  - `invitation.vue` buttons now call the API, show an error toast on failure,
    and are disabled while working

## Found while working

- 5 packages have blocked install scripts (npm blocked them for safety):
  `@parcel/watcher`, `@prisma/engines`, `bcrypto`, `esbuild`, `prisma`.
  The build works, but `prisma generate` may need them approved later.
- `npm audit` reports vulnerabilities (not checked in detail).
- `timeAgo` in `src/tools/timeago.ts` returns English text ("2 hours ago"),
  but the UI is Persian. Now used by `invitation.vue`.