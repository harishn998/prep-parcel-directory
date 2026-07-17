-- ─────────────────────────────────────
-- 0010_fix_approve_insert.sql
--
-- Phase 3.1c fix. 0009's approve_partner_submission used a positional
-- `insert ... values (v_partner.*)`, which tried to write partners.search_vector
-- — a GENERATED ALWAYS column (0005) — and failed with:
--   "cannot insert a non-DEFAULT value into column search_vector".
--
-- This create-or-replace is IDENTICAL to 0009 except the INSERT now names every
-- real partners column explicitly and OMITS the generated search_vector (Postgres
-- fills it automatically). The admin check, FOR UPDATE lock, pending guard,
-- user->partner promotion, submission update, and audit insert are unchanged.
--
-- Generated columns excluded from the insert: search_vector (the only one).
-- No table/column changes; function only. Apply as a single execution.
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

  -- Build the partner row from the admin-reviewed payload, forced hidden and
  -- owned by the submitter. jsonb_populate_record maps snake_case keys to
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

  -- Explicit-column insert. Every real partners column is listed; the only
  -- GENERATED ALWAYS column (search_vector) is omitted so Postgres computes it.
  insert into public.partners (
    id, owner_id, slug, name, tagline, description, about,
    logo_placeholder, logo_url, cover_gradient, cover_image_url,
    location, country, country_code, state, state_full_name, city, city_full_name,
    region, served_states,
    year_founded, years_in_business, employee_count, active_brands_served,
    minimum_order_volume, pricing_model, response_time, fulfillment_speed, order_accuracy,
    services, service_categories, integrations, certifications, specialties,
    rating, review_count, rating_breakdown, detailed_services, contact,
    verified, is_featured, is_active, is_claimed, profile_score, plan,
    meta_title, meta_description, created_at, updated_at
  ) values (
    v_partner.id, v_partner.owner_id, v_partner.slug, v_partner.name, v_partner.tagline, v_partner.description, v_partner.about,
    v_partner.logo_placeholder, v_partner.logo_url, v_partner.cover_gradient, v_partner.cover_image_url,
    v_partner.location, v_partner.country, v_partner.country_code, v_partner.state, v_partner.state_full_name, v_partner.city, v_partner.city_full_name,
    v_partner.region, v_partner.served_states,
    v_partner.year_founded, v_partner.years_in_business, v_partner.employee_count, v_partner.active_brands_served,
    v_partner.minimum_order_volume, v_partner.pricing_model, v_partner.response_time, v_partner.fulfillment_speed, v_partner.order_accuracy,
    v_partner.services, v_partner.service_categories, v_partner.integrations, v_partner.certifications, v_partner.specialties,
    v_partner.rating, v_partner.review_count, v_partner.rating_breakdown, v_partner.detailed_services, v_partner.contact,
    v_partner.verified, v_partner.is_featured, v_partner.is_active, v_partner.is_claimed, v_partner.profile_score, v_partner.plan,
    v_partner.meta_title, v_partner.meta_description, v_partner.created_at, v_partner.updated_at
  );

  -- Promote the submitter, but ONLY user -> partner. An admin submitter (or an
  -- already-partner) is left untouched — no downgrade, ever.
  update public.profiles
    set role = 'partner'
    where id = v_sub.submitted_by
      and role = 'user';

  -- Mark the submission approved and link it to the new partner.
  update public.partner_submissions
    set status = 'approved',
        reviewed_by = v_admin,
        target_partner_id = v_partner.id,
        updated_at = now()
    where id = p_submission_id;

  -- Audit.
  insert into public.admin_actions
    (admin_id, action_type, target_table, target_id, metadata)
  values
    (v_admin, 'partner_submission_approved', 'partner_submissions', p_submission_id,
     jsonb_build_object('partner_id', v_partner.id, 'name', v_partner.name, 'slug', v_partner.slug));

  return v_partner.id;
end;
$$;

grant execute on function public.approve_partner_submission(uuid, jsonb) to authenticated;
revoke execute on function public.approve_partner_submission(uuid, jsonb) from public;
revoke execute on function public.approve_partner_submission(uuid, jsonb) from anon;
