-- ─────────────────────────────────────
-- 0011_admin_select_partners.sql
--
-- Phase 3.1c-fix (root cause). partners had no admin SELECT policy — only
-- 0001's "Public can read active partners" (using is_active = true). So admins
-- could not read OR update hidden (is_active=false) partners via the RLS client:
--   • a freshly-approved hidden partner 404'd on /admin/partners/[id]
--   • publish (update is_active=true) matched 0 rows (a SELECT policy also gates
--     UPDATE row-targeting)
--   • hidden partners were missing from the admin list and media writes failed
--
-- This adds the missing admin read path so all admin partner ops work under RLS,
-- letting the app drop its service-role workaround.
--
-- CRITICAL: scoped `to authenticated`. It must NOT be unscoped — an unscoped
-- policy would make anon (signed-out) directory reads evaluate is_admin(), whose
-- EXECUTE was revoked from anon, yielding "permission denied for function
-- is_admin()" and breaking the public directory. Scoping to authenticated leaves
-- anon's path entirely on the existing public is_active=true policy. No grant
-- changes to is_admin().
-- ─────────────────────────────────────

create policy "Admins can read all partners"
  on public.partners for select
  to authenticated
  using (public.is_admin());
