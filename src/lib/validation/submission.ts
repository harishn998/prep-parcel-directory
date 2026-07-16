import { z } from "zod";
import { CATEGORIES, COUNTRIES } from "@/lib/taxonomy";

// Authoritative allow-lists, derived from the same taxonomy the directory uses.
// Keeps self-reported slugs in sync with category/location routing.
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
const STATE_SLUGS = new Set(COUNTRIES.flatMap((c) => c.states.map((s) => s.slug)));

/**
 * Public "List your 3PL" submission — the self-reportable subset of a partner
 * listing. Field names mirror partners columns / PartnerFormData so Phase 3.1c
 * can map payload → partners cleanly:
 *   name               → partners.name
 *   description        → partners.description
 *   serviceCategories  → partners.service_categories (slugs)
 *   servedStates       → partners.served_states (state slugs)
 *   website / email    → partners.contact (jsonb { website, email })
 * Admin-only fields (is_active, verified, is_featured, owner_id, slug) are NOT
 * collected here — those are set during 3.1c approval.
 */
export const listingSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Enter your company name.").max(120),
  website: z
    .string()
    .trim()
    .url("Enter a valid website URL (including https://)."),
  email: z.string().trim().email("Enter a valid contact email."),
  description: z
    .string()
    .trim()
    .min(20, "Add at least a sentence describing what you do.")
    .max(2000, "Keep the description under 2000 characters."),
  serviceCategories: z
    .array(z.string())
    .min(1, "Select at least one service.")
    .refine((a) => a.every((s) => CATEGORY_SLUGS.has(s)), "Unknown service selected."),
  servedStates: z
    .array(z.string())
    .min(1, "Select at least one location you serve.")
    .refine((a) => a.every((s) => STATE_SLUGS.has(s)), "Unknown location selected."),
});

export type ListingSubmissionInput = z.infer<typeof listingSubmissionSchema>;
