-- ─────────────────────────────────────
-- 0007_add_partner_enums.sql
--
-- Phase 3.1a — partner self-listing, DB foundation (part 1 of 2).
--
-- ENUM VALUES ONLY. Postgres forbids adding a new enum value AND using it in
-- the same transaction, so this migration ONLY introduces the values. The
-- companion 0008_partner_listings.sql (which references them) must run in a
-- SEPARATE, LATER transaction.
--
-- Run order is mandatory: 0007 BEFORE 0008.
-- ─────────────────────────────────────

-- New role for 3PLs who own/manage their own listing after admin approval.
-- Existing values: 'user', 'admin' (see 0002_auth.sql).
alter type public.user_role add value if not exists 'partner';

-- New audit action types for the submissions queue. admin_action_type is an
-- enum (see 0004_admin_writes.sql), so these must be added here, not in 0008.
alter type public.admin_action_type add value if not exists 'partner_submission_created';
alter type public.admin_action_type add value if not exists 'partner_submission_approved';
alter type public.admin_action_type add value if not exists 'partner_submission_rejected';
