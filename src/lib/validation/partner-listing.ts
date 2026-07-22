import { z } from "zod";
import { partnerFormSchema } from "./partner";

/**
 * Partner-facing self-edit schema (Phase 3.2).
 *
 * Derived from the admin partnerFormSchema but with every PROTECTED /
 * admin-managed field OMITTED, so a partner submission can never even express
 * a change to them. This is the app-layer half of the defense; the DB-layer
 * half is the column-guard trigger in 0012_partner_self_service.sql.
 *
 * Omitted here: slug, verified, isFeatured, isActive. (owner_id, plan,
 * profile_score, rating, review_count never existed in the form schema.)
 *
 * `.partial()` — the dashboard may PATCH any subset of the editable fields.
 */
export const partnerListingUpdateSchema = partnerFormSchema
  .omit({ slug: true, verified: true, isFeatured: true, isActive: true })
  .partial();

export type PartnerListingUpdateData = z.infer<typeof partnerListingUpdateSchema>;
