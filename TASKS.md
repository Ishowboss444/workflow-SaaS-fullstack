# TASKS

## To do

### Backend
- `accept()` does 4 sequential DB calls — independent queries could run together with `Promise.all`.
- `sender()` does 4 sequential DB calls (2 findUnique + authorization + create).
- No input validation on any backend route (no Zod / Joi).
- `Assignment` model: no create/update/delete routes or controller. No creation UI.
- After a worker accepts an invite, there is no redirect to the worker dashboard.
- `authControler.js` line 72: `console.error(err)` in login catch — acceptable but note.
- `workplaceControler.js` `delete()`: no return on non-owner branch (returns 409 but no explicit return before fall-through).
- No centralized error handler middleware (only process.on handlers).
- `REFRESH_TOKEN_SECRET` is unused.
- Logout endpoint added but frontend does not call it yet.

### Frontend
- `product.ts` reads token at module load (stale token bug) + has `console.log(token)`.
- `JobListView.vue` routes to `myInvitations`, which does not exist (dead button).
- `JobListView.vue` filter chips are rendered but never applied to list.
- All 5 API files + 2 starter views hardcode `http://localhost:3000`.
- `myAssignments.vue` — placeholder (5 lines).
- `workplace.vue` (worker) — placeholder.
- `Home.vue` (manager) — placeholder.
- `WorkDistributionView.vue` + `AddJobStep4View.vue` — hardcoded workers array, no API call.
- Multiple files have `console.log` debug lines (JobListView, JobDetail*, etc.).
- `FullfilledLoading.vue` has literal markdown code fence inside it.
- No `.env` / `import.meta.env` / Vite proxy in frontend.
- `useGlobal.ts` file vs `useGlobalStore` export naming mismatch.
- `JobListView.vue` imports `@/stores/useProductStore.js` (`.js` extension on `.ts` file).

### Lint problems (npx eslint src)
- `no-undef` — ESLint does not know browser/Node names. Need `languageOptions.globals` in `eslint.config.js`.
- `vue/multi-word-component-names` (9) — `Home.vue`, `invitation.vue`, `workplace.vue`.
- `vue/attributes-order` (26) — safe to auto-fix with `npx eslint src --fix`.

## Doing

- (nothing)

## Done

- `feat: user search feels fast now` (Job A):
  - `Hiration.vue` no longer hides the whole list while searching.
  - `Hiration.vue` no longer adds the same person twice.
  - `Hiration.vue` shows "ارسال شد" on the card after a real invite is sent.
  - `api/user.ts` + `api/invitation.ts` check `response.ok` and throw.
  - The token is now read inside each function, not at module load.
  - `useUsersStore` / `useInvitationsStore` show a toast on error.

- `fix: broken SCSS import path in SuccessView and WorkDistributionView` — build passes again.
- Installed `@eslint/js`, `eslint-plugin-vue`, `vue-eslint-parser`, `eslint-config-prettier`.
- `fix: all real ESLint problems` (0 left, ignoring 3 config-only rules).
- `fix: invite accept/reject now really saves` (security).

- `fix: backend security fixes` (Job 1):
  - `invitationControler.js`: fixed null workplace compare (was `Number(null) === Number(null)` → true).
  - `invitationControler.js`: added null check for contact (was crashing with 500).
  - `invitationControler.js`: removed all `console.log` debug lines.
  - `authMiddleware.js`: removed 3 `console.log` lines (was printing JWT + username).
  - `authMiddleware.js`: added try/catch around `jwt.verify` (was crashing on bad token).
  - `authControler.js`: removed `console.log` debug lines.
  - `authControler.js`: fixed signup status code (400 → 409 for duplicate username).
  - `authControler.js`: added `expiresIn: '24h'` to JWT.
  - `authControler.js`: added `logout()` method that clears cookie.
  - `usersRoutes.js`: removed `console.log(username)`.
  - `usersRoutes.js`: strips `passwordHash` from response (was leaking password hash!).
  - `productsControler.js`: fixed dead auth check in `addProduct` (was always false).
  - `productsControler.js`: fixed `this.res(409)` → `this.res.status(409)` (was throwing TypeError).
  - `productsControler.js`: fixed `description` field (was set from `name`).
  - `productsControler.js`: removed `console.log` debug lines.
  - `productsControler.js`: added `return` before responses, added proper error responses in catch.
  - `authRoutes.js`: added `await` to `signup()` and `login()` calls.
  - `authRoutes.js`: added `POST /auth/logout` route.
  - `server.js`: fixed CORS — was wide open, now restricted to `CLIENT_URL` or localhost:5173.
  - `router/index.js`: fixed `requiresManager` guard (was `!role && !workplace`, now `!role`).
  - `invitationRoutes.js`: added `await` to all controller calls.
  - `productsRoutes.js`: added `await` to all controller calls.
  - `workplaceRoutes.js`: added `await` to all controller calls.
  - `db.js`: removed query logging (was logging every query in development).
  - `workplaceControler.js`: removed `console.log` debug lines.
  - `workplaceControler.js`: added try/catch to `delete()` method.
  - `workplaceControler.js`: added `return` before response in `delete()`.

## Found while working

- 5 packages have blocked install scripts (npm blocked them for safety):
  `@parcel/watcher`, `@prisma/engines`, `bcrypto`, `esbuild`, `prisma`.
- `npm audit` reports vulnerabilities (not checked in detail).
- `timeAgo` in `src/tools/timeago.ts` returns English text, but the UI is Persian.
- `FullfilledLoading.vue` has literal markdown code fences inside it.
- `StaterWorkerTemplate.vue` has literal markdown code fences inside it.
- `invitation.vue` has literal markdown code fences inside it.
- `workplace-choice.vue` has literal markdown code fences inside it.

---

## Business Logic (Kargah Man)

### Overview
Kargah Man is a workplace management SaaS for tailoring workshops.

### User Roles
- **MANAGER** — owns one workplace. Creates products, invites workers, distributes work.
- **WORKER** — belongs to one workplace. Receives work assignments, sees own tasks.

### Key Rules
1. A workplace has exactly **one** manager (the owner).
2. A user can belong to **only one workplace** at a time.
3. A manager **cannot** join another workplace as a worker.
4. A worker **cannot** accept an invitation to a second workplace.
5. Invitations do **not** create membership — only acceptance does.
6. Rejected/expired invitations must **not** create membership.
7. Membership rules are enforced by the **backend**, not the frontend.

### Products and Broadcasting
- A manager creates a product with a total quantity.
- The manager **broadcasts** (assigns) portions of that quantity to workers.
- Each assignment links: product + worker + quantity.
- Total assigned quantity cannot exceed the product's total quantity.

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
