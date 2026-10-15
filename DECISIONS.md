# DECISIONES

## Architecture Decisions

### Monorepo structure
We keep frontend and backend in one repo. Frontend is Vue 3 + Vite,
backend is Express. They share the `src/` folder but are clearly separated:
- `src/` — Vue frontend (views, components, stores, api)
- `src/server/` — Express backend (routes, controllers, middleware)

### API call pattern
Frontend API functions live in `src/api/`. Each function:
1. Reads the token from `localStorage` **inside** the function (not at module load).
2. Sends the request with `Authorization: Bearer ${token}`.
3. Checks `response.ok` before using the data.
4. Throws on error so the caller can show a toast.

### State management
Pinia stores in `src/stores/`:
- `useAuthStore` — current user, login/logout
- `useGlobalStore` — username, role, field, workplaceId (synced with localStorage)
- `useUsersStore` — user search
- `useInvitationsStore` — invitations
- `useProductStore` — products

### Database
PostgreSQL via Prisma ORM. Schema in `prisma/schema.prisma`.
RLS must stay ON for every table. Service role key must never be used in frontend.

### Auth
JWT-based. Token stored in `localStorage` as `accessToken`.
Middleware checks `req.user` set by auth middleware.
Role-based authorization: `authorization('MANAGER')` middleware.

### UI Design
- Pink/indigo theme (see `src/assets/scss/_variables.scss`)
- RTL Persian UI
- Card-based layouts
- Max width 430px (mobile-first)
- SCSS with variables and mixins, no random colors

### Member Detail Page
- Route: `/managerDashboard/Members/:memberId`
- Click product → expand inline to show broadcasts (assignments)
- Show quantity + date for each broadcast
- Summary at top: total products, total quantity, member since
- Field names shown in Persian

## Key Constraints
1. One workplace = one manager (enforced by `ownerId @unique` in schema).
2. One user = one workplace at a time (`workplaceId` is a single Int, not an array).
3. Assignments cannot exceed product total quantity.
4. Backend enforces all membership rules, not frontend.
