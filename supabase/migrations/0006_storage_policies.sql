-- Phase 2C: RLS policies for the partner-media storage bucket
--
-- The bucket itself must be created in the Supabase Dashboard (Storage → New
-- bucket): name `partner-media`, Public = YES, 5 MB limit, allowed MIME types
-- image/png, image/jpeg, image/webp. Bucket creation is a Storage API action,
-- NOT SQL — this migration only manages the RLS policies on storage.objects.
--
-- Bucket is public-read (URLs work without auth, required for the public
-- directory). Writes (insert/update/delete) are restricted to authenticated
-- admins only. Path convention: partner-media/partners/{partner_id}/{filename}
--
-- Reuses public.is_admin() from 0002_auth.sql — do NOT recreate it.

-- Drop any existing policies on storage.objects for this bucket
-- (idempotent so this migration can be re-run safely)
drop policy if exists "Public read access for partner-media" on storage.objects;
drop policy if exists "Admins can upload partner-media" on storage.objects;
drop policy if exists "Admins can update partner-media" on storage.objects;
drop policy if exists "Admins can delete partner-media" on storage.objects;

-- Public read: anyone can fetch any object from the partner-media bucket
create policy "Public read access for partner-media"
on storage.objects for select
using (bucket_id = 'partner-media');

-- Admin write: only authenticated admins can upload
create policy "Admins can upload partner-media"
on storage.objects for insert
with check (
  bucket_id = 'partner-media'
  and auth.role() = 'authenticated'
  and public.is_admin()
);

-- Admin write: only authenticated admins can update (overwrite) objects.
-- Both `using` (which existing rows may be updated) AND `with check` (what the
-- updated row must satisfy) are required so upsert overwrites stay admin-gated.
create policy "Admins can update partner-media"
on storage.objects for update
using (
  bucket_id = 'partner-media'
  and auth.role() = 'authenticated'
  and public.is_admin()
)
with check (
  bucket_id = 'partner-media'
  and auth.role() = 'authenticated'
  and public.is_admin()
);

-- Admin write: only authenticated admins can delete objects
create policy "Admins can delete partner-media"
on storage.objects for delete
using (
  bucket_id = 'partner-media'
  and auth.role() = 'authenticated'
  and public.is_admin()
);

do $$ begin raise notice 'Phase 2C: storage.objects RLS policies for partner-media created'; end $$;

-- Verification (run separately after applying — expect 4 rows):
-- select policyname, cmd
-- from pg_policies
-- where schemaname = 'storage' and tablename = 'objects'
--   and policyname like '%partner-media%'
-- order by policyname;
