"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";

import {
  updatePartnerLogo,
  removePartnerLogo,
} from "@/lib/actions/admin/partners";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp";
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

type LogoUploadAction = (
  partnerId: string,
  formData: FormData
) => Promise<{ success: boolean; logoUrl?: string; error?: string }>;
type LogoRemoveAction = (
  partnerId: string
) => Promise<{ success: boolean; error?: string }>;

export function LogoUploader({
  partnerId,
  currentUrl,
  uploadAction = updatePartnerLogo,
  removeAction = removePartnerLogo,
}: {
  partnerId: string;
  currentUrl: string | null;
  // Injectable so the partner dashboard can pass ownership-scoped actions
  // instead of the admin (requireAdmin) ones. Defaults keep admin usage intact.
  uploadAction?: LogoUploadAction;
  removeAction?: LogoRemoveAction;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  function validate(file: File): string | null {
    if (!ALLOWED.has(file.type)) {
      return "Unsupported file type. Use PNG, JPG, or WebP.";
    }
    if (file.size > MAX_BYTES) return "Logo must be under 2 MB.";
    return null;
  }

  async function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      toast.error(err);
      return;
    }
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadAction(partnerId, fd);
    setBusy(false);
    if (res.success && res.logoUrl) {
      setUrl(res.logoUrl);
      toast.success("Logo uploaded");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to upload logo");
    }
  }

  async function handleRemove() {
    setBusy(true);
    const res = await removeAction(partnerId);
    setBusy(false);
    if (res.success) {
      setUrl(null);
      toast.success("Logo removed");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to remove logo");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="flex items-start gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label={url ? "Replace logo" : "Upload logo"}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "group relative flex h-[140px] w-[140px] shrink-0 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed bg-surface-tint p-3 text-center transition-colors outline-none focus-visible:border-indigo",
          dragging ? "border-indigo bg-indigo-soft" : "border-border",
          busy && "cursor-wait opacity-80"
        )}
      >
        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Partner logo"
              className="absolute inset-0 h-full w-full object-contain p-3"
            />
            {!busy && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/0 opacity-0 transition-all group-hover:bg-navy/55 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-[12px] font-medium text-navy">
                  <RefreshCw className="h-3 w-3" strokeWidth={2} />
                  Replace
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-text-3" strokeWidth={1.75} />
            <span className="text-[12px] font-medium leading-tight text-text-2">
              Drag logo here or click to browse
            </span>
            <span className="text-[11px] leading-tight text-text-3">
              PNG, JPG, WebP · max 2MB
            </span>
          </>
        )}

        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
            <Loader2 className="h-5 w-5 animate-spin text-indigo" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {url && (
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy transition-colors hover:text-indigo disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
            Replace
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-2 transition-colors hover:text-destructive disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
