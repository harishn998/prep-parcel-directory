import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";

export type AdminActionType =
  | "partner_created"
  | "partner_updated"
  | "partner_deactivated"
  | "partner_reactivated"
  | "partner_verified"
  | "partner_unverified"
  | "partner_featured"
  | "partner_unfeatured"
  | "warehouse_created"
  | "warehouse_updated"
  | "warehouse_deleted"
  | "user_role_changed";

export interface LogAdminActionParams {
  actionType: AdminActionType;
  targetTable: string;
  targetId: string;
  metadata?: Record<string, unknown> | null;
}

/**
 * Insert a row into public.admin_actions. Best-effort:
 * a failure here must never abort the parent mutation.
 *
 * RLS on admin_actions allows insert for any is_admin() caller,
 * so we use the regular server client (no service-role bypass needed).
 */
export async function logAdminAction(params: LogAdminActionParams): Promise<void> {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return;

    const supabase = await createSupabaseServerClient();
    await supabase.from("admin_actions").insert({
      admin_id: profile.id,
      action_type: params.actionType,
      target_table: params.targetTable,
      target_id: params.targetId,
      metadata: params.metadata ?? null,
    });
  } catch {
    // Audit logging is best-effort; never block the parent operation.
  }
}
