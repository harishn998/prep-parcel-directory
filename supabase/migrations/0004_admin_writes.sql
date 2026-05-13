-- ─────────────────────────────────────
-- 0004_admin_writes.sql
--
-- Admin write capability + activity audit log.
--
-- Companion to 0002_auth.sql which set up read-only RLS for profiles
-- and the is_admin() helper. This migration:
--   1. Grants admins write access to partners, warehouses, reviews via RLS.
--   2. Adds an admin_actions audit table that every server-action mutation
--      writes to (see src/lib/actions/admin/_audit.ts).
--
-- Soft-delete only on partners (is_active = false). Warehouses can be
-- hard-deleted (they're sub-records keyed to a partner via CASCADE).
-- ─────────────────────────────────────

-- ─────────────────────────────────────
-- WRITE POLICIES: partners
-- ─────────────────────────────────────

create policy "Admins can insert partners"
  on public.partners for insert
  with check (public.is_admin());

create policy "Admins can update partners"
  on public.partners for update
  using (public.is_admin())
  with check (public.is_admin());

-- No DELETE policy on partners — deactivation is the soft-delete path.

-- ─────────────────────────────────────
-- WRITE POLICIES: warehouses (sub-records, hard delete OK)
-- ─────────────────────────────────────

create policy "Admins can insert warehouses"
  on public.warehouses for insert
  with check (public.is_admin());

create policy "Admins can update warehouses"
  on public.warehouses for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete warehouses"
  on public.warehouses for delete
  using (public.is_admin());

-- ─────────────────────────────────────
-- WRITE POLICIES: reviews (Phase 3 moderation prep)
-- ─────────────────────────────────────

create policy "Admins can update reviews"
  on public.reviews for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete reviews"
  on public.reviews for delete
  using (public.is_admin());

-- ─────────────────────────────────────
-- ADMIN ACTIONS audit log
-- ─────────────────────────────────────

create type public.admin_action_type as enum (
  'partner_created',
  'partner_updated',
  'partner_deactivated',
  'partner_reactivated',
  'partner_verified',
  'partner_unverified',
  'partner_featured',
  'partner_unfeatured',
  'warehouse_created',
  'warehouse_updated',
  'warehouse_deleted',
  'user_role_changed'
);

create table public.admin_actions (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references public.profiles(id),
  action_type public.admin_action_type not null,
  target_table text not null,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_admin_actions_created_at on public.admin_actions(created_at desc);
create index idx_admin_actions_admin_id on public.admin_actions(admin_id);
create index idx_admin_actions_target on public.admin_actions(target_table, target_id);

alter table public.admin_actions enable row level security;

create policy "Admins can read admin_actions"
  on public.admin_actions for select
  using (public.is_admin());

create policy "Admins can insert admin_actions"
  on public.admin_actions for insert
  with check (public.is_admin());

-- No update / delete policies — audit rows are immutable.

-- ─────────────────────────────────────
-- Verify
-- ─────────────────────────────────────

do $$
begin
  raise notice 'Admin write policies and admin_actions table created successfully';
end $$;
