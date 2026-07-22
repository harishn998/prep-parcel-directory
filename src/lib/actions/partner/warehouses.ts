"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  warehouseFormSchema,
  warehouseUpdateSchema,
  type WarehouseFormData,
  type WarehouseUpdateData,
} from "@/lib/validation/warehouse";
import {
  warehouseFormToInsertRow,
  warehouseUpdateToRow,
} from "@/lib/data/mappers";
import type { ActionResult } from "@/lib/actions/admin/_result";
import { resolveOwnedPartner } from "./_owned";

// Partner warehouse CRUD (Phase 3.2b). Same signatures as the admin warehouse
// actions so the shared WarehouseManager can call either — but authorization is
// by OWNERSHIP, not requireAdmin(). All writes run on the cookie-session (RLS)
// client (never service_role) and are gated by the warehouse owner policies
// (0013), which check the parent partner's owner_id = auth.uid().
//
//   • create: partner_id is taken from resolveOwnedPartner() (session), NEVER
//     the client arg → a warehouse can only be attached to the caller's own
//     listing.
//   • update/delete: keyed by warehouse id; the owner UPDATE/DELETE policies
//     restrict the row set to warehouses whose parent the caller owns, so a
//     foreign warehouse id simply matches no row.
// No admin_actions audit — partners can't write that table.

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

function revalidateOwn(slug: string): void {
  revalidatePath("/directory");
  revalidatePath("/directory/[slug]", "page");
  revalidatePath(`/directory/${slug}`);
  revalidatePath("/partner");
}

export async function createOwnWarehouse(
  _partnerId: string,
  input: WarehouseFormData
): Promise<ActionResult<{ id: string }>> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const parsed = warehouseFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  // partner_id from the session-owned listing, not the client arg.
  const insertRow = warehouseFormToInsertRow(parsed.data, owned.id);
  const { data, error } = await supabase
    .from("warehouses")
    .insert(insertRow)
    .select("id")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to create warehouse" };
  }

  revalidateOwn(owned.slug);
  return { success: true, data: { id: data.id as string } };
}

export async function updateOwnWarehouse(
  id: string,
  input: WarehouseUpdateData
): Promise<ActionResult<void>> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const parsed = warehouseUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  const updateRow = warehouseUpdateToRow(parsed.data);
  // RLS owner UPDATE policy limits this to warehouses of a listing the caller
  // owns; the extra partner_id scope is belt-and-suspenders.
  const { data, error } = await supabase
    .from("warehouses")
    .update(updateRow)
    .eq("id", id)
    .eq("partner_id", owned.id)
    .select("id")
    .maybeSingle();
  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: "Warehouse not found" };

  revalidateOwn(owned.slug);
  return { success: true, data: undefined };
}

export async function deleteOwnWarehouse(
  id: string
): Promise<ActionResult<void>> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("warehouses")
    .delete()
    .eq("id", id)
    .eq("partner_id", owned.id)
    .select("id")
    .maybeSingle();
  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: "Warehouse not found" };

  revalidateOwn(owned.slug);
  return { success: true, data: undefined };
}
