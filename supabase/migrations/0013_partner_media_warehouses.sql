-- ─────────────────────────────────────
-- 0013_partner_media_warehouses.sql
--
-- Phase 3.2b — unlock partner MEDIA + WAREHOUSE editing on /partner. Purely
-- additive RLS. Closes the two access gaps that forced 3.2 to defer both tabs:
--   • warehouses writes (0004) are is_admin()-only, and warehouse READS (0001)
--     are gated on the parent partner.is_active=true — so an owner could not
--     even read their own HIDDEN listing's warehouses.
--   • storage.objects writes on partner-media (0006) are is_admin()-only.
--
-- Everything here is scoped `to authenticated` and keyed off partner ownership
-- (partners.owner_id = auth.uid()). No SECURITY DEFINER functions are added, so
-- there is nothing to revoke from anon. Existing admin + public-read policies
-- are left UNCHANGED (we only ADD owner policies with new names).
--
-- SAFETY: none of these policies touch public.partners, so they cannot let a
-- partner change is_active / verified / is_featured (those remain governed by
-- the 0012 column-guard trigger + the 0008 owner row policy). These policies
-- only grant access to `warehouses` rows and `storage.objects` in the
-- partner-media bucket for listings the caller already owns.
-- ─────────────────────────────────────

-- ── 1. warehouses: owner SELECT (incl. hidden parent) ──
-- Cross-table EXISTS against partners (NOT self-referential → allowed). Lets an
-- owner read warehouses of any partner row they own regardless of is_active.
create policy "Owners can read own warehouses"
  on public.warehouses for select
  to authenticated
  using (
    exists (
      select 1 from public.partners p
      where p.id = warehouses.partner_id
        and p.owner_id = auth.uid()
    )
  );

-- ── 2. warehouses: owner INSERT / UPDATE / DELETE ──
-- Same ownership predicate. INSERT needs WITH CHECK (the new row's partner_id
-- must belong to the caller); UPDATE needs both; DELETE needs USING.
create policy "Owners can insert own warehouses"
  on public.warehouses for insert
  to authenticated
  with check (
    exists (
      select 1 from public.partners p
      where p.id = warehouses.partner_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Owners can update own warehouses"
  on public.warehouses for update
  to authenticated
  using (
    exists (
      select 1 from public.partners p
      where p.id = warehouses.partner_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.partners p
      where p.id = warehouses.partner_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Owners can delete own warehouses"
  on public.warehouses for delete
  to authenticated
  using (
    exists (
      select 1 from public.partners p
      where p.id = warehouses.partner_id
        and p.owner_id = auth.uid()
    )
  );

-- ── 3. storage.objects: owner write on partner-media ──
-- Path convention (0006 / partner-media.ts): partners/{partner_id}/{file}.
-- The 2nd path segment is the partner id. We compare it as text (no ::uuid cast
-- → a malformed path simply fails to match instead of erroring) against a
-- partners row the caller owns. `storage.objects.name` is fully qualified inside
-- the subquery so it is NOT captured by partners.name.
-- upsert uploads hit INSERT (new) or UPDATE (overwrite); remove() hits DELETE —
-- mirror the admin trio so partner + admin edits are interchangeable.
create policy "Owners can upload own partner-media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'partner-media'
    and split_part(name, '/', 1) = 'partners'
    and exists (
      select 1 from public.partners p
      where p.id::text = split_part(storage.objects.name, '/', 2)
        and p.owner_id = auth.uid()
    )
  );

create policy "Owners can update own partner-media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'partner-media'
    and split_part(name, '/', 1) = 'partners'
    and exists (
      select 1 from public.partners p
      where p.id::text = split_part(storage.objects.name, '/', 2)
        and p.owner_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'partner-media'
    and split_part(name, '/', 1) = 'partners'
    and exists (
      select 1 from public.partners p
      where p.id::text = split_part(storage.objects.name, '/', 2)
        and p.owner_id = auth.uid()
    )
  );

create policy "Owners can delete own partner-media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'partner-media'
    and split_part(name, '/', 1) = 'partners'
    and exists (
      select 1 from public.partners p
      where p.id::text = split_part(storage.objects.name, '/', 2)
        and p.owner_id = auth.uid()
    )
  );

do $$
begin
  raise notice '0013_partner_media_warehouses applied: warehouse owner CRUD + storage owner write';
end $$;
