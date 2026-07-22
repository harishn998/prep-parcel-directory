"use server";

import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  partnerListingUpdateSchema,
  type PartnerListingUpdateData,
} from "@/lib/validation/partner-listing";
import { partnerUpdateToRow } from "@/lib/data/mappers";
import type { ActionResult } from "@/lib/actions/admin/_result";

// Belt-and-suspenders: even though partnerListingUpdateSchema omits these and
// partnerUpdateToRow only emits keys that are present, strip the protected
// snake_case columns from the write row so no future mapper/schema change can
// leak a protected write past the app layer. The DB trigger (0012) is the
// authoritative guard; this keeps the app honest too.
const PROTECTED_COLUMNS = [
  "is_active",
  "verified",
  "is_featured",
  "owner_id",
  "slug",
  "plan",
  "profile_score",
  "rating",
  "review_count",
] as const;

function firstZodMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown[] }).issues) &&
    (error as { issues: { message?: string }[] }).issues.length > 0
  ) {
    return (
      (error as { issues: { message?: string }[] }).issues[0]?.message ??
      "Invalid input"
    );
  }
  return "Invalid input";
}

/**
 * Partner self-edit of THEIR OWN listing (Phase 3.2).
 *
 * Runs on the cookie-session (RLS) client — NOT service_role. Writes are
 * authorized by the "Owners can update own partner" policy (0008) and further
 * constrained by the column-guard trigger (0012). We additionally scope the
 * UPDATE to `.eq("owner_id", profile.id)` so a partner can only ever touch a
 * row they own, and pass `partnerId` so a partner with (hypothetically) more
 * than one listing edits exactly the one on screen.
 */
export async function updateOwnListing(
  partnerId: string,
  input: PartnerListingUpdateData
): Promise<ActionResult<{ id: string }>> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "partner") {
    return { success: false, error: "Not authorized" };
  }

  const parsed = partnerListingUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const updateRow = partnerUpdateToRow(parsed.data);
  for (const col of PROTECTED_COLUMNS) {
    delete (updateRow as Record<string, unknown>)[col];
  }

  if (Object.keys(updateRow).length === 0) {
    return { success: false, error: "Nothing to update" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .update(updateRow)
    .eq("id", partnerId)
    .eq("owner_id", profile.id)
    .select("id, slug")
    .maybeSingle();

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Could not update your listing.",
    };
  }

  // Public pages the listing appears on, plus the dashboard itself.
  revalidatePath("/directory");
  revalidatePath("/directory/[slug]", "page");
  if (data.slug) revalidatePath(`/directory/${data.slug as string}`);
  revalidatePath("/partner");

  return { success: true, data: { id: data.id as string } };
}
