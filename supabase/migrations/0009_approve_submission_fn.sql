-- ─────────────────────────────────────
-- 0009_approve_submission_fn.sql
--
-- Phase 3.1c — atomic "approve submission → create hidden partner" as a single
-- SECURITY DEFINER function so all five steps commit or roll back together.
-- (No table/column changes; this adds one function only.)
--
-- Called from the approveSubmission server action (which runs requireAdmin()).
-- The function ALSO re-checks is_admin() itself, so it can't be abused even if
-- called directly with a non-admin JWT.
--
-- Steps (one transaction):
--   1+2. INSERT partners row, is_active=false, owner_id = submission.submitted_by
--   3.   promote submitter user -> partner (NEVER downgrade admin/partner)
--   4.   mark submission approved (reviewed_by, target_partner_id)
--   5.   write admin_actions audit row
-- Idempotency: the submission is locked FOR UPDATE and must be 'pending', so a
-- second approve raises and rolls back — no duplicate partner.
-- ─────────────────────────────────────

create or replace function public.approve_partner_submission(
  p_submission_id uuid,
  p_partner jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub public.partner_submissions%rowtype;
  v_partner public.partners%rowtype;
  v_admin uuid := auth.uid();
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  -- Lock the submission; idempotency guard.
  select * into v_sub from public.partner_submissions
    where id = p_submission_id
    for update;
  if not found then
    raise exception 'Submission not found' using errcode = 'P0002';
  end if;
  if v_sub.status <> 'pending' then
    raise exception 'Submission already %', v_sub.status using errcode = 'P0001';
  end if;

  -- 1 + 2: build the partner row from the admin-reviewed payload, forced hidden
  -- and owned by the submitter. jsonb_populate_record maps snake_case keys to
  -- columns; we override the fields the caller must not control and coalesce
  -- the columns the form doesn't send so their sensible defaults survive.
  v_partner := jsonb_populate_record(null::public.partners, p_partner);
  v_partner.id := gen_random_uuid();
  v_partner.owner_id := v_sub.submitted_by;
  v_partner.is_active := false;
  v_partner.created_at := now();
  v_partner.updated_at := now();
  v_partner.verified := coalesce(v_partner.verified, false);
  v_partner.is_featured := coalesce(v_partner.is_featured, false);
  v_partner.is_claimed := coalesce(v_partner.is_claimed, false);
  v_partner.review_count := coalesce(v_partner.review_count, 0);
  v_partner.profile_score := coalesce(v_partner.profile_score, 0);
  v_partner.plan := coalesce(v_partner.plan, 'free');
  v_partner.served_states := coalesce(v_partner.served_states, '{}');
  v_partner.services := coalesce(v_partner.services, '{}');
  v_partner.service_categories := coalesce(v_partner.service_categories, '{}');
  v_partner.integrations := coalesce(v_partner.integrations, '{}');
  v_partner.certifications := coalesce(v_partner.certifications, '{}');
  v_partner.specialties := coalesce(v_partner.specialties, '{}');

  insert into public.partners values (v_partner.*);

  -- 3: promote the submitter, but ONLY user -> partner. An admin submitter (or
  -- an already-partner) is left untouched — no downgrade, ever.
  update public.profiles
    set role = 'partner'
    where id = v_sub.submitted_by
      and role = 'user';

  -- 4: mark the submission approved and link it to the new partner.
  update public.partner_submissions
    set status = 'approved',
        reviewed_by = v_admin,
        target_partner_id = v_partner.id,
        updated_at = now()
    where id = p_submission_id;

  -- 5: audit.
  insert into public.admin_actions
    (admin_id, action_type, target_table, target_id, metadata)
  values
    (v_admin, 'partner_submission_approved', 'partner_submissions', p_submission_id,
     jsonb_build_object('partner_id', v_partner.id, 'name', v_partner.name, 'slug', v_partner.slug));

  return v_partner.id;
end;
$$;

grant execute on function public.approve_partner_submission(uuid, jsonb) to authenticated;
