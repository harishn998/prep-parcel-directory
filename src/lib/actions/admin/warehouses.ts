"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
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
import { logAdminAction } from "./_audit";
import type { ActionResult } from "./_result";

function revalidateAffected(partnerSlug?: string | null): void {
  revalidatePath("/directory");
  revalidatePath("/directory/[slug]", "page");
  revalidatePath("/admin/partners");
  if (partnerSlug) revalidatePath(`/directory/${partnerSlug}`);
}

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

async function partnerSlugFor(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  partnerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("partners")
    .select("slug")
    .eq("id", partnerId)
    .maybeSingle();
  return (data?.slug as string | undefined) ?? null;
}

export async function createWarehouse(
  partnerId: string,
  input: WarehouseFormData
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = warehouseFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  const insertRow = warehouseFormToInsertRow(parsed.data, partnerId);
  const { data, error } = await supabase
    .from("warehouses")
    .insert(insertRow)
    .select("id")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to create warehouse" };
  }

  const slug = await partnerSlugFor(supabase, partnerId);
  await logAdminAction({
    actionType: "warehouse_created",
    targetTable: "warehouses",
    targetId: data.id as string,
    metadata: { partnerId, city: parsed.data.city },
  });
  revalidateAffected(slug);
  return { success: true, data: { id: data.id as string } };
}

export async function updateWarehouse(
  id: string,
  input: WarehouseUpdateData
): Promise<ActionResult<void>> {
  await requireAdmin();

  const parsed = warehouseUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  const updateRow = warehouseUpdateToRow(parsed.data);
  const { data, error } = await supabase
    .from("warehouses")
    .update(updateRow)
    .eq("id", id)
    .select("partner_id")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Failed to update warehouse" };
  }

  const slug = await partnerSlugFor(supabase, data.partner_id as string);
  await logAdminAction({
    actionType: "warehouse_updated",
    targetTable: "warehouses",
    targetId: id,
    metadata: { fields: Object.keys(parsed.data) },
  });
  revalidateAffected(slug);
  return { success: true, data: undefined };
}

export async function deleteWarehouse(id: string): Promise<ActionResult<void>> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  // Look up partner_id before delete (need it for revalidation + audit).
  const { data: existing } = await supabase
    .from("warehouses")
    .select("partner_id, city")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("warehouses").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  if (existing?.partner_id) {
    const slug = await partnerSlugFor(
      supabase,
      existing.partner_id as string
    );
    await logAdminAction({
      actionType: "warehouse_deleted",
      targetTable: "warehouses",
      targetId: id,
      metadata: { partnerId: existing.partner_id, city: existing.city },
    });
    revalidateAffected(slug);
  }
  return { success: true, data: undefined };
}
