-- ─────────────────────────────────────
-- 0003_fix_auth_trigger.sql
--
-- Hotfix for the handle_new_user() trigger from 0002_auth.sql.
--
-- Problem: the original trigger silently swallowed errors via
--   `on conflict (id) do nothing` with no exception handler. If the insert
--   failed for any reason other than a primary-key collision, the failure
--   would propagate and abort the auth.users insert entirely — blocking
--   user signup. Worse, the silent-success path made the failure mode
--   invisible until manual SQL backfills were attempted.
--
-- Fix:
--   1. Drop and recreate handle_new_user() with an exception handler that
--      RAISE WARNINGs on failure and still returns NEW so signup succeeds.
--   2. Grant explicit execute privileges to authenticated, anon, service_role.
--   3. Add a self-healing ensure_profile() RPC the application can call from
--      a server context to materialize a missing profile row on first read.
-- ─────────────────────────────────────

-- Drop existing trigger + function (CASCADE not needed; trigger drop is explicit)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Recreate handle_new_user with proper error handling
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    -- Never block signup. Surface the failure in logs so we can debug.
    raise warning 'handle_new_user failed for auth user %: % (%)',
      new.id, sqlerrm, sqlstate;
    return new;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.handle_new_user() to authenticated, anon, service_role;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────
-- ensure_profile() — self-healing RPC
--
-- Called by the application (getCurrentProfile in src/lib/auth/session.ts)
-- when a profile row is missing for the calling user. Reads from
-- auth.users (security-definer required) and inserts the missing profile.
-- Safe no-op if the profile already exists or if called unauthenticated.
-- ─────────────────────────────────────

create or replace function public.ensure_profile()
returns void as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_full_name text;
  v_avatar_url text;
begin
  if v_user_id is null then
    return;
  end if;

  if exists (select 1 from public.profiles where id = v_user_id) then
    return;
  end if;

  select
    u.email,
    coalesce(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name'
    ),
    u.raw_user_meta_data->>'avatar_url'
  into v_email, v_full_name, v_avatar_url
  from auth.users u
  where u.id = v_user_id;

  if v_email is null then
    return;
  end if;

  insert into public.profiles (id, email, full_name, avatar_url)
  values (v_user_id, v_email, v_full_name, v_avatar_url)
  on conflict (id) do nothing;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.ensure_profile() to authenticated;

-- ─────────────────────────────────────
-- Verification block
-- ─────────────────────────────────────

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created'
      and tgrelid = 'auth.users'::regclass
  ) then
    raise exception 'on_auth_user_created trigger missing';
  end if;

  if not exists (
    select 1 from pg_proc
    where proname = 'handle_new_user' and pronamespace = 'public'::regnamespace
  ) then
    raise exception 'handle_new_user function missing';
  end if;

  if not exists (
    select 1 from pg_proc
    where proname = 'ensure_profile' and pronamespace = 'public'::regnamespace
  ) then
    raise exception 'ensure_profile function missing';
  end if;

  raise notice 'Trigger and function verified successfully';
end $$;
