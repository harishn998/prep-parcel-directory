"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  partnerFormSchema,
  partnerUpdateSchema,
  type PartnerFormData,
  type PartnerUpdateData,
} from "@/lib/validation/partner";
import {
  partnerFormToInsertRow,
  partnerUpdateToRow,
} from "@/lib/data/mappers";
import { logAdminAction } from "./_audit";
import type { ActionResult } from "./_result";
import {
  uploadPartnerLogo,
  uploadPartnerCover,
  deletePartnerLogo,
  deletePartnerCover,
  type CropArea,
} from "@/lib/storage/partner-media";

function revalidatePublicPartnerPages(slug?: string | null): void {
  revalidatePath("/directory");
  revalidatePath("/directory/[slug]", "page");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/admin/partners");
  if (slug) {
    revalidatePath(`/directory/${slug}`);
  }
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

export async function createPartner(
  input: PartnerFormData
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();

  const parsed = partnerFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  const insertRow = partnerFormToInsertRow(parsed.data);
  const { data, error } = await supabase
    .from("partners")
    .insert(insertRow)
    .select("id, slug")
    .single();

  if (error || !data) {
    const message = error?.message ?? "Failed to create partner";
    return {
      success: false,
      error: message.includes("duplicate")
        ? `Slug "${parsed.data.slug}" is already taken.`
        : message,
    };
  }

  await logAdminAction({
    actionType: "partner_created",
    targetTable: "partners",
    targetId: data.id as string,
    metadata: { slug: data.slug, name: parsed.data.name },
  });

  revalidatePublicPartnerPages(data.slug as string);
  return {
    success: true,
    data: { id: data.id as string, slug: data.slug as string },
  };
}

export async function updatePartner(
  id: string,
  input: PartnerUpdateData
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();

  const parsed = partnerUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: firstZodMessage(parsed.error) };
  }

  const supabase = await createSupabaseServerClient();
  const updateRow = partnerUpdateToRow(parsed.data);

  const { data, error } = await supabase
    .from("partners")
    .update(updateRow)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error || !data) {
    const message = error?.message ?? "Failed to update partner";
    return {
      success: false,
      error: message.includes("duplicate")
        ? `Slug is already taken.`
        : message,
    };
  }

  await logAdminAction({
    actionType: "partner_updated",
    targetTable: "partners",
    targetId: id,
    metadata: { fields: Object.keys(parsed.data) },
  });

  revalidatePublicPartnerPages(data.slug as string);
  return {
    success: true,
    data: { id: data.id as string, slug: data.slug as string },
  };
}

async function setPartnerActive(
  id: string,
  isActive: boolean
): Promise<ActionResult<void>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .update({ is_active: isActive })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Partner not found" };
  }
  await logAdminAction({
    actionType: isActive ? "partner_reactivated" : "partner_deactivated",
    targetTable: "partners",
    targetId: id,
  });
  revalidatePublicPartnerPages(data.slug as string);
  return { success: true, data: undefined };
}

export async function deactivatePartner(id: string): Promise<ActionResult<void>> {
  return setPartnerActive(id, false);
}

export async function reactivatePartner(id: string): Promise<ActionResult<void>> {
  return setPartnerActive(id, true);
}

export async function togglePartnerVerified(
  id: string,
  currentValue: boolean
): Promise<ActionResult<{ verified: boolean }>> {
  await requireAdmin();
  const next = !currentValue;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .update({ verified: next })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Partner not found" };
  }
  await logAdminAction({
    actionType: next ? "partner_verified" : "partner_unverified",
    targetTable: "partners",
    targetId: id,
    metadata: { from: currentValue, to: next },
  });
  revalidatePublicPartnerPages(data.slug as string);
  return { success: true, data: { verified: next } };
}

export async function togglePartnerFeatured(
  id: string,
  currentValue: boolean
): Promise<ActionResult<{ isFeatured: boolean }>> {
  await requireAdmin();
  const next = !currentValue;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .update({ is_featured: next })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !data) {
    return { success: false, error: error?.message ?? "Partner not found" };
  }
  await logAdminAction({
    actionType: next ? "partner_featured" : "partner_unfeatured",
    targetTable: "partners",
    targetId: id,
    metadata: { from: currentValue, to: next },
  });
  revalidatePublicPartnerPages(data.slug as string);
  return { success: true, data: { isFeatured: next } };
}

// ---------------------------------------------------------------------------
// Phase 2C — partner media (logo + cover) upload / removal
// ---------------------------------------------------------------------------

// Refresh the partner row's slug for revalidation, then revalidate everything
// the image appears on (public directory + this admin edit page).
async function revalidateAfterMedia(partnerId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("partners")
    .select("slug")
    .eq("id", partnerId)
    .maybeSingle();
  revalidatePublicPartnerPages((data?.slug as string | undefined) ?? null);
  revalidatePath(`/admin/partners/${partnerId}`);
}

export async function updatePartnerLogo(
  partnerId: string,
  formData: FormData
): Promise<{ success: boolean; logoUrl?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  const result = await uploadPartnerLogo(partnerId, file);
  if (!result.success || !result.publicUrl) {
    return { success: false, error: result.error ?? "Upload failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ logo_url: result.publicUrl })
    .eq("id", partnerId);
  if (error) {
    return { success: false, error: `DB update failed: ${error.message}` };
  }

  await logAdminAction({
    actionType: "partner_updated",
    targetTable: "partners",
    targetId: partnerId,
    metadata: { fields: ["logo_url"] },
  });

  await revalidateAfterMedia(partnerId);
  return { success: true, logoUrl: result.publicUrl };
}

export async function updatePartnerCover(
  partnerId: string,
  formData: FormData
): Promise<{ success: boolean; coverUrl?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  // Optional crop area (original-image pixel coords) from the crop UI
  const cropAreaRaw = formData.get("cropArea");
  let cropArea: CropArea | undefined;
  if (typeof cropAreaRaw === "string" && cropAreaRaw.length > 0) {
    try {
      cropArea = JSON.parse(cropAreaRaw) as CropArea;
    } catch {
      return { success: false, error: "Invalid crop area" };
    }
  }

  const result = await uploadPartnerCover(partnerId, file, cropArea);
  if (!result.success || !result.publicUrl) {
    return { success: false, error: result.error ?? "Upload failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ cover_image_url: result.publicUrl })
    .eq("id", partnerId);
  if (error) {
    return { success: false, error: `DB update failed: ${error.message}` };
  }

  await logAdminAction({
    actionType: "partner_updated",
    targetTable: "partners",
    targetId: partnerId,
    metadata: { fields: ["cover_image_url"] },
  });

  await revalidateAfterMedia(partnerId);
  return { success: true, coverUrl: result.publicUrl };
}

export async function removePartnerLogo(
  partnerId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await deletePartnerLogo(partnerId);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ logo_url: null })
    .eq("id", partnerId);
  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction({
    actionType: "partner_updated",
    targetTable: "partners",
    targetId: partnerId,
    metadata: { fields: ["logo_url"], action: "removed" },
  });

  await revalidateAfterMedia(partnerId);
  return { success: true };
}

export async function removePartnerCover(
  partnerId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const result = await deletePartnerCover(partnerId);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ cover_image_url: null })
    .eq("id", partnerId);
  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction({
    actionType: "partner_updated",
    targetTable: "partners",
    targetId: partnerId,
    metadata: { fields: ["cover_image_url"], action: "removed" },
  });

  await revalidateAfterMedia(partnerId);
  return { success: true };
}
