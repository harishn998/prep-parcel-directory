"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  accountProfileSchema,
  type AccountProfileUpdate,
} from "@/lib/validation/account";
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
 * Update the currently signed-in user's own profile (display name only).
 *
 * Relies on the "Users can update own profile" RLS policy (0002_auth.sql),
 * whose WITH CHECK pins `role` to its current value — so a self-update can
 * never escalate privileges. We only touch full_name here.
 */
export async function updateOwnProfile(
  input: AccountProfileUpdate
): Promise<ActionResult<{ fullName: string | null }>> {
  const profile = await getCurrentProfile();
  if (!profile) {
    return { success: false, error: "Not signed in" };
  }

  const parsed = accountProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const trimmed = parsed.data.fullName.trim();
  const fullName = trimmed === "" ? null : trimmed;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", profile.id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/account");
  revalidatePath("/admin/settings");
  return { success: true, data: { fullName } };
}
