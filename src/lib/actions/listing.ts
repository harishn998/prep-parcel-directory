"use server";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  listingSubmissionSchema,
  type ListingSubmissionInput,
} from "@/lib/validation/submission";
import type { ActionResult } from "@/lib/actions/admin/_result";

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
 * Submit a new 3PL listing for review. Inserts ONE pending row into
 * partner_submissions as the AUTHENTICATED user (cookie-session server client,
 * RLS-enforced — NOT service_role). No partners row is created and no
 * admin_actions entry is written; that happens at approval time (Phase 3.1c).
 */
export async function submitListing(
  input: ListingSubmissionInput
): Promise<ActionResult<{ id: string }>> {
  // Identity comes from the session, never from the client payload.
  const profile = await getCurrentProfile();
  if (!profile) {
    return { success: false, error: "You must be signed in to submit a listing." };
  }

  const parsed = listingSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }
  const d = parsed.data;

  const supabase = await createSupabaseServerClient();

  // One in-flight submission per user (own RLS-readable rows).
  const { data: existing } = await supabase
    .from("partner_submissions")
    .select("id")
    .eq("submitted_by", profile.id)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();
  if (existing) {
    return {
      success: false,
      error: "You already have a submission pending review.",
    };
  }

  // payload keys mirror partners columns so 3.1c can map them directly.
  const payload = {
    name: d.name,
    description: d.description,
    serviceCategories: d.serviceCategories,
    servedStates: d.servedStates,
    contact: { website: d.website, email: d.email },
  };

  const { data, error } = await supabase
    .from("partner_submissions")
    .insert({
      // submitted_by MUST equal auth.uid(); the RLS INSERT with-check enforces
      // this server-side too, so a spoofed id would be rejected outright.
      submitted_by: profile.id,
      type: "new",
      status: "pending",
      payload,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: { id: data.id as string } };
}
