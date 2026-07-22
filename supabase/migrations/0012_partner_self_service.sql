-- ─────────────────────────────────────
-- 0012_partner_self_service.sql
--
-- Phase 3.2 — partner self-service. Closes the TWO RLS gaps left open by
-- 0008_partner_listings.sql:
--   (1) No owner SELECT. Public read is `is_active = true` (0001) and admin
--       read is is_admin() (0011). An owner had NO path to read their own
--       PENDING (is_active=false) listing → the partner dashboard would 404.
--   (2) Owner UPDATE (0008 "Owners can update own partner") is ROW-scoped, not
--       column-scoped, so an owner could self-publish (is_active), self-verify
--       (verified), self-feature, reassign ownership, or spoof ranking/rating.
--
-- DEV-first. Both policies scoped `to authenticated` (mirrors 0011's rationale:
-- an unscoped policy makes anon directory reads evaluate is_admin()/owner_id
-- unnecessarily; scoping keeps anon entirely on the public is_active=true path).
-- ─────────────────────────────────────

-- ── 1. Owner SELECT (gap 1) ───────────
-- Lets an owner read THEIR OWN row regardless of is_active, so a partner can
-- see a listing that is still pending review. Row-scoped by owner_id; does not
-- widen anyone else's visibility.
create policy "Owners can read own partner"
  on public.partners for select
  to authenticated
  using (owner_id = auth.uid());

-- ── 2. Column-guard trigger (gap 2) ───
-- BEFORE UPDATE on partners. If the updater is a normal authenticated user
-- (NOT an admin) and any PROTECTED column changed, reject the whole UPDATE.
-- This makes the protected columns admin-only at the DB layer, independent of
-- the RLS row policy and independent of the UI — so a forged direct PostgREST
-- call from an owner is rejected too.
--
-- Protected: is_active, verified, is_featured, owner_id, slug, plan,
--            profile_score, rating, review_count.
--
-- SECURITY INVOKER (default): auth.uid() resolves to the calling end-user;
-- is_admin() (0002) is itself SECURITY DEFINER so it still reads profiles.
--   • Admins bypass (is_admin() = true).
--   • Trusted server contexts bypass (auth.uid() IS NULL): the service_role
--     client and SECURITY DEFINER functions (e.g. approve_submission, which is
--     INSERT-only anyway) run with no end-user JWT. Owners ALWAYS have a
--     non-null uid, and anon has no UPDATE policy at all, so this bypass can
--     never be reached by the actors we're guarding against.
create or replace function public.guard_partner_protected_columns()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.is_active     is distinct from old.is_active
       or new.verified      is distinct from old.verified
       or new.is_featured   is distinct from old.is_featured
       or new.owner_id      is distinct from old.owner_id
       or new.slug          is distinct from old.slug
       or new.plan          is distinct from old.plan
       or new.profile_score is distinct from old.profile_score
       or new.rating        is distinct from old.rating
       or new.review_count  is distinct from old.review_count
    then
      raise exception
        'Not allowed: attempted to change an admin-managed field on your listing'
        using errcode = '42501'; -- insufficient_privilege
    end if;
  end if;
  return new;
end;
$$;

-- SECURITY INVOKER (not DEFINER) → nothing to revoke from anon. Trigger
-- functions execute in the trigger context, not via a direct EXECUTE grant.
drop trigger if exists trg_guard_partner_protected_columns on public.partners;
create trigger trg_guard_partner_protected_columns
  before update on public.partners
  for each row
  execute function public.guard_partner_protected_columns();

do $$
begin
  raise notice '0012_partner_self_service applied: owner SELECT policy + column-guard trigger';
end $$;
