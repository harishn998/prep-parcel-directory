-- ─────────────────────────────────────
-- USER ROLES + PROFILES
-- ─────────────────────────────────────

create type public.user_role as enum ('user', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role default 'user' not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_role on public.profiles(role);
create index idx_profiles_email on public.profiles(email);

-- updated_at trigger (reuses set_updated_at() from 0001_init.sql)
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────
-- Auto-create profile on user signup
-- ─────────────────────────────────────

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
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────
-- is_admin() helper — security definer
-- Used by RLS policies on multiple tables.
-- Runs with elevated privileges to avoid recursive RLS evaluation.
-- ─────────────────────────────────────

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- Allow authenticated users to execute this function
grant execute on function public.is_admin() to authenticated, anon;

-- ─────────────────────────────────────
-- RLS POLICIES on profiles
-- ─────────────────────────────────────

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles (via is_admin helper, not direct query)
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Users can update their own profile, but cannot escalate their role
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

-- Admins can update any profile (including roles)
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- No insert policy needed — profiles are created by the handle_new_user trigger only
-- No delete policy — users cannot self-delete profiles; cascades from auth.users deletion
