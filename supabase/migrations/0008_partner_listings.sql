-- ─────────────────────────────────────
-- 0008_partner_listings.sql
--
-- Phase 3.1a — partner self-listing, DB foundation (part 2 of 2).
-- Depends on the enum values introduced in 0007_add_partner_enums.sql.
--
-- ── Existing partners visibility mechanism (reused, NOT reinvented) ──
-- public.partners has NO status enum. Visibility is governed by the
-- `is_active boolean default true` column:
--   • 0001_init.sql — "Public can read active partners" → using (is_active = true)
--   • 0004_admin_writes.sql — soft-delete = set is_active = false
-- Therefore a PENDING (unapproved) self-listing stays HIDDEN by having
-- is_active = false. Admin approval flips it to true. We add NO new
-- visibility column. (`verified` / `is_featured` are quality flags, not
-- visibility gates, and are left alone.)
-- ─────────────────────────────────────

-- ── 1. Listing ownership ──────────────
-- A partner row may be owned by the profile that submitted/claimed it.
-- on delete set null: deleting the profile orphans the listing (admin keeps
-- it) rather than cascading the partner away.
alter table public.partners
  add column if not exists owner_id uuid references public.profiles(id) on delete set null;

create index if not exists idx_partners_owner_id on public.partners(owner_id);

-- ── 2. Submissions queue ──────────────
create table if not exists public.partner_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'new' check (type in ('new', 'claim')),
  target_partner_id uuid references public.partners(id) on delete set null,
  payload jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_submissions_submitted_by on public.partner_submissions(submitted_by);
create index if not exists idx_partner_submissions_status on public.partner_submissions(status);
create index if not exists idx_partner_submissions_target on public.partner_submissions(target_partner_id);

-- Reuse the shared set_updated_at() trigger fn from 0001_init.sql.
create trigger trg_partner_submissions_updated_at
  before update on public.partner_submissions
  for each row execute function public.set_updated_at();

-- ── 3. RLS: partner_submissions ───────
-- Golden rule honored: no policy queries its own table in a subquery.
-- Ownership checks use the row's own `submitted_by` column; admin checks use
-- the is_admin() SECURITY DEFINER helper (which reads profiles, not this table).
alter table public.partner_submissions enable row level security;

-- Submitter can create rows, but only attributed to themselves.
create policy "Submitters can insert own submissions"
  on public.partner_submissions for insert
  with check (submitted_by = auth.uid());

-- Submitter can read their own submissions.
create policy "Submitters can read own submissions"
  on public.partner_submissions for select
  using (submitted_by = auth.uid());

-- Admins can read every submission.
create policy "Admins can read all submissions"
  on public.partner_submissions for select
  using (public.is_admin());

-- Admins can update (approve / reject / annotate) any submission.
create policy "Admins can update submissions"
  on public.partner_submissions for update
  using (public.is_admin())
  with check (public.is_admin());

-- No public read, no submitter UPDATE/DELETE — omission = denied under RLS.

-- ── 4. RLS: partners owner UPDATE ─────
-- Existing policies (public read of active rows, admin insert/update) are
-- unchanged. This ADDS the ability for an owner to update their own row.
create policy "Owners can update own partner"
  on public.partners for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ⚠ KNOWN GAP (flagged, intentionally NOT solved this slice):
-- RLS is row-scoped, not column-scoped. The policy above lets an OWNER write
-- ANY column on their own partner row — including is_active, verified,
-- is_featured. So an owner could self-publish (is_active=true) or self-verify,
-- bypassing moderation. Acceptable now: there is NO partner-facing UI in this
-- slice, so the surface is unreachable. Phase 3.2's edit form will whitelist
-- writable fields and/or add a column-guard BEFORE UPDATE trigger. Do not
-- rely on this policy for moderation integrity until then.

do $$
begin
  raise notice '0008_partner_listings applied: owner_id, partner_submissions, RLS';
end $$;
