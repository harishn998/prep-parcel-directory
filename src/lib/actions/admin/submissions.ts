"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { partnerFormSchema, type PartnerFormData } from "@/lib/validation/partner";
import { rejectSubmissionSchema } from "@/lib/validation/submission";
import { partnerFormToInsertRow } from "@/lib/data/mappers";
import { logAdminAction } from "./_audit";
import type { ActionResult } from "./_result";

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
 * Approve a pending submission: atomically create the (hidden) partner, assign
 * ownership, promote the submitter, mark the submission approved, and audit —
 * all inside the approve_partner_submission SECURITY DEFINER function (0009),
 * so it's all-or-nothing and safe against double-approval.
 *
 * The partner is created with is_active=false; publishing is a separate,
 * deliberate step on the partner's admin page.
 */
export async function approveSubmission(
  submissionId: string,
  input: PartnerFormData
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();

  const parsed = partnerFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  // Reuse the same form → row mapper the manual create flow uses. is_active and
  // owner_id in this row are ignored/overridden by the function.
  const insertRow = partnerFormToInsertRow(parsed.data);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("approve_partner_submission", {
    p_submission_id: submissionId,
    p_partner: insertRow,
  });

  if (error) {
    const msg = error.message ?? "Approval failed";
    if (error.code === "23505" || msg.toLowerCase().includes("duplicate")) {
      return { success: false, error: `Slug "${parsed.data.slug}" is already taken.` };
    }
    if (msg.includes("already")) {
      return { success: false, error: "This submission has already been reviewed." };
    }
    if (msg.includes("not found")) {
      return { success: false, error: "Submission not found." };
    }
    if (msg.includes("Not authorized")) {
      return { success: false, error: "Not authorized." };
    }
    return { success: false, error: msg };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/partners");
  revalidatePath("/directory");
  return {
    success: true,
    data: { id: data as string, slug: parsed.data.slug },
  };
}

/**
 * Reject a pending submission with a required note. No partners row, no role
 * change. Guarded to only act on a row still 'pending' (idempotency).
 */
export async function rejectSubmission(
  submissionId: string,
  note: string
): Promise<ActionResult<void>> {
  await requireAdmin();

  const parsed = rejectSubmissionSchema.safeParse({ note });
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return { success: false, error: "Not signed in" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partner_submissions")
    .update({
      status: "rejected",
      reviewed_by: profile.id,
      review_note: parsed.data.note,
    })
    .eq("id", submissionId)
    .eq("status", "pending") // idempotency: only a pending row can be rejected
    .select("id")
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }
  if (!data) {
    return { success: false, error: "This submission has already been reviewed." };
  }

  await logAdminAction({
    actionType: "partner_submission_rejected",
    targetTable: "partner_submissions",
    targetId: submissionId,
    metadata: { note: parsed.data.note },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  return { success: true, data: undefined };
}
