# TASKS

## To do

### Backend
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
- No endpoint to get a member's assignments (broadcasts) — needed for Member detail page.

### Frontend
- `Members.vue` is a placeholder — needs full build.
- `MemberDetail.vue` does not exist — needs full build.
- No route for `/managerDashboard/Members/:memberId`.

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
  - `Hiration.vue` no longer adds the same person twice — it checks the id first.
  - `Hiration.vue` shows "ارسال شد" on the card after a real invite is sent
    (`person.invited = true`).
  - `api/user.ts` + `api/invitation.ts` check `response.ok` and throw.
  - The token is now read inside each function, not at module load.
  - `useUsersStore` / `useInvitationsStore` show a toast on error instead of
    `console.log`.

- `fix: broken SCSS import path in SuccessView and WorkDistributionView` — build passes again.
- Installed `@eslint/js`, `eslint-plugin-vue`, `vue-eslint-parser`,
  `eslint-config-prettier` — `npx eslint src` runs now.
- `fix: all real ESLint problems` (0 left, ignoring 3 config-only rules).
- `fix: invite accept/reject now really saves` (security).

## Found while working

- 5 packages have blocked install scripts (npm blocked them for safety):
  `@parcel/watcher`, `@prisma/engines`, `bcrypto`, `esbuild`, `prisma`.
- `npm audit` reports vulnerabilities (not checked in detail).
- `timeAgo` in `src/tools/timeago.ts` returns English text ("2 hours ago"),
  but the UI is Persian. Now used by `invitation.vue`.

---

## Business Logic (Kargah Man)

### Overview
Kargah Man is a workplace management SaaS for tailoring workshops. It replaces
paper notebooks with a digital system for tracking products, quantities, and
work assignments.

### User Roles
- **MANAGER** — owns one workplace. Creates products, invites workers,
  distributes work (broadcasts), tracks progress.
- **WORKER** — belongs to one workplace. Receives work assignments, sees
  own tasks, notifies manager when done.

### Key Rules
1. A workplace has exactly **one** manager (the owner).
2. A user can belong to **only one** workplace at a time.
3. A manager **cannot** join another workplace as a worker.
4. A worker **cannot** accept an invitation to a second workplace.
5. Invitations do **not** create membership — only acceptance does.
6. Rejected/expired invitations must **not** create membership.
7. Membership rules are enforced by the **backend**, not the frontend.

### Products and Broadcasting
- A manager creates a product with a total quantity (e.g., 1,000 units).
- The manager **broadcasts** (assigns) portions of that quantity to workers.
- Each assignment links: product + worker + quantity.
- Total assigned quantity cannot exceed the product's total quantity.
- Each assignment is traceable to the correct product and worker.

### Database Models
| Model | Purpose |
|-------|---------|
| `User` | All users (managers + workers). Has `role`, `field`, `workplaceId`. |
| `Workplace` | A workplace. Has one `owner` (manager) and many `members` (workers). |
| `Product` | A product with quantity, colors, salary, tailor amounts. |
| `Assignment` | A "broadcast" — links a product to a worker with a quantity. |
| `Invite` | Workplace invitation. Status: PENDING, ACCEPTED, REJECTED. |

### Field Types (Worker Specialization)
| DB Value | Persian |
|----------|---------|
| `rightTailor` | خیاط راست |
| `topTailor` | خیاط بالا |
| `midTailor` | خیاط وسط |
| `general` | عمومی |

### Pages
| Route | Page | Role |
|-------|------|------|
| `/managerDashboard/Members` | Members list | Manager |
| `/managerDashboard/Members/:memberId` | Member detail + broadcasts | Manager |
| `/managerDashboard/Hiration` | Invite workers | Manager |
| `/managerDashboard/jobs` | Job list | Manager |
| `/workerDashboard/assignments` | My assignments | Worker |
