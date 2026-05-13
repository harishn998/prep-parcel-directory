"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  userRoleUpdateSchema,
  type UserRoleUpdate,
} from "@/lib/validation/user";
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

export async function updateUserRole(
  input: UserRoleUpdate
): Promise<ActionResult<{ userId: string; newRole: "user" | "admin" }>> {
  await requireAdmin();

  const parsed = userRoleUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }
  const { userId, newRole } = parsed.data;

  const currentProfile = await getCurrentProfile();
  if (!currentProfile) {
    return { success: false, error: "Not signed in" };
  }
  if (userId === currentProfile.id) {
    return {
      success: false,
      error: "You cannot change your own role.",
    };
  }

  const supabase = await createSupabaseServerClient();

  // Look up the target user (also needed for audit metadata).
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .maybeSingle();
  if (!existing) {
    return { success: false, error: "User not found" };
  }
  if (existing.role === newRole) {
    return { success: true, data: { userId, newRole } };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);
  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction({
    actionType: "user_role_changed",
    targetTable: "profiles",
    targetId: userId,
    metadata: {
      from: existing.role,
      to: newRole,
      userEmail: existing.email,
    },
  });

  revalidatePath("/admin/users");
  return { success: true, data: { userId, newRole } };
}
