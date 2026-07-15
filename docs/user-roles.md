# User Roles

This app uses a **two-role** access model. Roles are a Postgres enum, mirrored in
TypeScript, and stored on the `profiles` table. There is currently **no**
partner-owner, moderator, or editor role — a regular `user` is simply an
authenticated viewer.

## The roles

| Role | How assigned | Capabilities |
|------|--------------|--------------|
| `user` (default) | Auto-assigned on sign-up (`role default 'user'`) | View the directory, sign in, and manage **their own** profile. No `/admin` access; no write access to partners, warehouses, or reviews. |
| `admin` | Promoted by another admin from `/admin/users` (an admin cannot demote themselves) | Full control: create/edit/verify/feature/deactivate partners; create/update/delete warehouses; moderate reviews; promote/demote users; view audit logs. |

## Where the roles are defined

| What | Location |
|------|----------|
| DB enum | `create type public.user_role as enum ('user', 'admin')` — `supabase/migrations/0002_auth.sql:5` |
| Column | `profiles.role public.user_role default 'user' not null` — `supabase/migrations/0002_auth.sql:12` |
| TS type | `export type UserRole = "user" \| "admin"` — `src/lib/data/db-types.ts:103` |

## How access is enforced (defense in depth)

1. **Middleware** — gates all `/admin/*` routes, redirecting non-admins — `src/middleware.ts`
2. **Layout guard** — the admin layout re-checks `role === "admin"` server-side — `src/app/admin/layout.tsx`
3. **App helpers** — `isCurrentUserAdmin()` and `requireAdmin()` guard server actions — `src/lib/auth/session.ts:44-54`
4. **Database RLS** — the `is_admin()` security-definer function backs every admin write policy — `supabase/migrations/0002_auth.sql:57-66`, `supabase/migrations/0004_admin_writes.sql`

## Auditing

Role changes are recorded as `user_role_changed` events in the `admin_actions`
table (with old/new role and the target user's email) —
`src/lib/actions/admin/users.ts:74-83`, `src/lib/actions/admin/_audit.ts`.

## Notes / gaps

- There is **no** partner-owner or moderator role today. A `user` cannot claim or
  edit any listing — all partner/warehouse content is admin-managed.
- Adding a future role (e.g. a business owner who manages their own listing) would
  require: a new value on the `user_role` enum, an ownership column linking that
  user to their partner/warehouse rows, and matching RLS policies plus app-level
  guards.
