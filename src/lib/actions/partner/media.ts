"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  uploadPartnerLogo,
  uploadPartnerCover,
  deletePartnerLogo,
  deletePartnerCover,
  type CropArea,
} from "@/lib/storage/partner-media";
import { resolveOwnedPartner } from "./_owned";

// Partner media actions (Phase 3.2b). Same signature as the admin media actions
// so the shared uploader components can call either — but authorization is by
// OWNERSHIP, not requireAdmin(). The partner id is ALWAYS resolved from the
// session (resolveOwnedPartner); the `partnerId` arg from the client is ignored
// for the storage path + DB write, so it can't point a write at another listing.
// Everything runs on the cookie-session (RLS) client — never service_role. The
// storage owner policies (0013) authorize the object write; the 0008 owner
// policy + 0012 column-guard authorize the logo_url/cover_image_url column
// write (neither url is a protected column). No admin_actions audit — partners
// can't write that table.

async function revalidateOwn(slug: string): Promise<void> {
  revalidatePath("/directory");
  revalidatePath("/directory/[slug]", "page");
  revalidatePath(`/directory/${slug}`);
  revalidatePath("/partner");
}

export async function updateOwnListingLogo(
  _partnerId: string,
  formData: FormData
): Promise<{ success: boolean; logoUrl?: string; error?: string }> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  const result = await uploadPartnerLogo(owned.id, file);
  if (!result.success || !result.publicUrl) {
    return { success: false, error: result.error ?? "Upload failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ logo_url: result.publicUrl })
    .eq("id", owned.id);
  if (error) return { success: false, error: `DB update failed: ${error.message}` };

  await revalidateOwn(owned.slug);
  return { success: true, logoUrl: result.publicUrl };
}

export async function removeOwnListingLogo(
  _partnerId: string
): Promise<{ success: boolean; error?: string }> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const result = await deletePartnerLogo(owned.id);
  if (!result.success) return { success: false, error: result.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ logo_url: null })
    .eq("id", owned.id);
  if (error) return { success: false, error: error.message };

  await revalidateOwn(owned.slug);
  return { success: true };
}

export async function updateOwnListingCover(
  _partnerId: string,
  formData: FormData
): Promise<{ success: boolean; coverUrl?: string; error?: string }> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  const cropAreaRaw = formData.get("cropArea");
  let cropArea: CropArea | undefined;
  if (typeof cropAreaRaw === "string" && cropAreaRaw.length > 0) {
    try {
      cropArea = JSON.parse(cropAreaRaw) as CropArea;
    } catch {
      return { success: false, error: "Invalid crop area" };
    }
  }

  const result = await uploadPartnerCover(owned.id, file, cropArea);
  if (!result.success || !result.publicUrl) {
    return { success: false, error: result.error ?? "Upload failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ cover_image_url: result.publicUrl })
    .eq("id", owned.id);
  if (error) return { success: false, error: `DB update failed: ${error.message}` };

  await revalidateOwn(owned.slug);
  return { success: true, coverUrl: result.publicUrl };
}

export async function removeOwnListingCover(
  _partnerId: string
): Promise<{ success: boolean; error?: string }> {
  const owned = await resolveOwnedPartner();
  if (!owned) return { success: false, error: "Not authorized" };

  const result = await deletePartnerCover(owned.id);
  if (!result.success) return { success: false, error: result.error };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partners")
    .update({ cover_image_url: null })
    .eq("id", owned.id);
  if (error) return { success: false, error: error.message };

  await revalidateOwn(owned.slug);
  return { success: true };
}
