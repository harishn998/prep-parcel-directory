// Server-only: imports sharp + createSupabaseServerClient (next/headers cookies),
// so this can never be bundled into a client component. Only ever called from
// the 'use server' actions in @/lib/actions/admin/partners.
import sharp from "sharp";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "partner-media";

// Path conventions — partner-media/partners/{partnerId}/{logo|cover}.{ext}
function logoPath(partnerId: string, ext: string): string {
  return `partners/${partnerId}/logo.${ext}`;
}

function coverPath(partnerId: string, ext: string): string {
  return `partners/${partnerId}/cover.${ext}`;
}

// Map MIME type to the file extension we'll store under
function extFromMime(mime: string): "png" | "jpg" | "webp" | null {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return null;
}

// sharp's toFormat() wants "jpeg", not "jpg"
function sharpFormat(ext: "png" | "jpg" | "webp"): "png" | "jpeg" | "webp" {
  return ext === "jpg" ? "jpeg" : ext;
}

const ALL_EXTS = ["png", "jpg", "webp"] as const;

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Process and upload a partner logo.
 * - Validates MIME and size (≤2 MB)
 * - Resizes to max 400×400 (fit inside, preserves aspect, no enlargement)
 * - Upserts to partners/{partnerId}/logo.{ext}, cleans up other-ext logos
 * - Returns the public URL with a cache-busting query
 */
export async function uploadPartnerLogo(
  partnerId: string,
  file: File
): Promise<UploadResult> {
  const ext = extFromMime(file.type);
  if (!ext) {
    return {
      success: false,
      error: "Unsupported file type. Use PNG, JPG, or WebP.",
    };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: "Logo must be under 2 MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await sharp(buffer)
      .resize(400, 400, { fit: "inside", withoutEnlargement: true })
      .toFormat(sharpFormat(ext), { quality: 90 })
      .toBuffer();

    const supabase = await createSupabaseServerClient();
    const path = logoPath(partnerId, ext);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, processed, {
        contentType: file.type,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Clean up logos stored under a different extension
    const stale = ALL_EXTS.filter((e) => e !== ext).map((e) =>
      logoPath(partnerId, e)
    );
    await supabase.storage.from(BUCKET).remove(stale);

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { success: true, publicUrl: `${urlData.publicUrl}?v=${Date.now()}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: `Processing failed: ${msg}` };
  }
}

/**
 * Process and upload a partner cover image.
 * - Validates MIME and size (≤5 MB)
 * - Optional cropArea (original-image pixel coords) is extracted first
 * - Resizes to 1920×640 (3:1) — `inside` when pre-cropped, else `cover`
 * - Upserts to partners/{partnerId}/cover.{ext}, cleans up other-ext covers
 */
export async function uploadPartnerCover(
  partnerId: string,
  file: File,
  cropArea?: CropArea
): Promise<UploadResult> {
  const ext = extFromMime(file.type);
  if (!ext) {
    return {
      success: false,
      error: "Unsupported file type. Use PNG, JPG, or WebP.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Cover image must be under 5 MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    let pipeline = sharp(buffer);

    if (cropArea) {
      pipeline = pipeline.extract({
        left: Math.max(0, Math.round(cropArea.x)),
        top: Math.max(0, Math.round(cropArea.y)),
        width: Math.round(cropArea.width),
        height: Math.round(cropArea.height),
      });
    }

    const processed = await pipeline
      .resize(1920, 640, {
        fit: cropArea ? "inside" : "cover",
        withoutEnlargement: true,
      })
      .toFormat(sharpFormat(ext), { quality: 88 })
      .toBuffer();

    const supabase = await createSupabaseServerClient();
    const path = coverPath(partnerId, ext);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, processed, {
        contentType: file.type,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    const stale = ALL_EXTS.filter((e) => e !== ext).map((e) =>
      coverPath(partnerId, e)
    );
    await supabase.storage.from(BUCKET).remove(stale);

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { success: true, publicUrl: `${urlData.publicUrl}?v=${Date.now()}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: `Processing failed: ${msg}` };
  }
}

/** Delete a partner's logo (every stored format) from storage. */
export async function deletePartnerLogo(partnerId: string): Promise<UploadResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const paths = ALL_EXTS.map((ext) => logoPath(partnerId, ext));
    await supabase.storage.from(BUCKET).remove(paths);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed",
    };
  }
}

/** Delete a partner's cover image (every stored format) from storage. */
export async function deletePartnerCover(partnerId: string): Promise<UploadResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const paths = ALL_EXTS.map((ext) => coverPath(partnerId, ext));
    await supabase.storage.from(BUCKET).remove(paths);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed",
    };
  }
}
