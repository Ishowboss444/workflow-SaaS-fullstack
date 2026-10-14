# TASKS

## To do

- `invitationControler.js` `sender()`: `Number(c.workplaceId) === Number(isOwner.workplaceId)`
  — if the manager has no `workplaceId`, `Number(null) === Number(null)` is `0 === 0`
  (true), so every invite wrongly says "you have invited this person".
- `invitationControler.js` `sender()`: `contact.receivedInvites` throws if the user
  does not exist, so the answer is a 500 "unknown issue" instead of "no such user".
- `accept()` does 5 sequential DB calls — the slowest endpoint. Independent queries
  could run together with `Promise.all`.
- `sender()` does 4 sequential DB calls (2 findUnique + authorization + create).
- `authMiddleware.js` and `authControler.js` still have `console.log` debug lines.
- `usersRoutes.js:11` has a `console.log(username)`.
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
- After a worker accepts an invite, there is no redirect to the worker dashboard.
- `db.js` logs every query in development (`log: ['query', ...]`). Console spam.

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

- `feat: user search feels fast now` (Job A):
  - `Hiration.vue` no longer hides the whole list while searching — the old
    results stay on screen and a small spinner shows inside the search button.
    This is what made it feel slow.
  - `Hiration.vue` no longer adds the same person twice — it checks the id first.
  - `Hiration.vue` shows "ارسال شد" on the card after a real invite is sent
    (`person.invited = true`).
  - `api/user.ts` + `api/invitation.ts` check `response.ok` and throw. Before,
    a server error gave `data.data === undefined`, which was pushed into the
    list and crashed the page on `person.name[0]`.
  - The token is now read inside each function, not at module load. Before it
    was read once at page load (while logged out) so it was always `null`.
  - `useUsersStore` / `useInvitationsStore` show a toast on error instead of
    `console.log`.

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