"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  updatePartnerCover,
  removePartnerCover,
} from "@/lib/actions/admin/partners";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp";
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const ASPECT = 3; // 3:1 cover banner

export function CoverUploader({
  partnerId,
  currentUrl,
}: {
  partnerId: string;
  currentUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Crop modal state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function validate(file: File): string | null {
    if (!ALLOWED.has(file.type)) {
      return "Unsupported file type. Use PNG, JPG, or WebP.";
    }
    if (file.size > MAX_BYTES) return "Cover image must be under 5 MB.";
    return null;
  }

  function openCropper(file: File) {
    const err = validate(file);
    if (err) {
      toast.error(err);
      return;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setPendingFile(file);
    setObjectUrl(URL.createObjectURL(file));
    setCrop(undefined);
    setCompletedCrop(undefined);
  }

  function closeCropper() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setPendingFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const next = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, ASPECT, width, height),
      width,
      height
    );
    setCrop(next);
  }

  async function upload(file: File, cropArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    if (cropArea) fd.append("cropArea", JSON.stringify(cropArea));
    const res = await updatePartnerCover(partnerId, fd);
    setBusy(false);
    closeCropper();
    if (res.success && res.coverUrl) {
      setUrl(res.coverUrl);
      toast.success("Cover image uploaded");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to upload cover image");
    }
  }

  function handleSaveCrop() {
    if (!pendingFile) return;
    const img = imgRef.current;
    if (!img || !completedCrop || completedCrop.width === 0) {
      // Nothing selected — fall back to auto-cover
      void upload(pendingFile);
      return;
    }
    // completedCrop is in displayed pixels; scale up to natural pixels
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    void upload(pendingFile, {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    });
  }

  async function handleRemove() {
    setBusy(true);
    const res = await removePartnerCover(partnerId);
    setBusy(false);
    if (res.success) {
      setUrl(null);
      toast.success("Cover image removed");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to remove cover image");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) openCropper(file);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        aria-label={url ? "Replace cover image" : "Upload cover image"}
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
          "group relative flex aspect-[3/1] w-full max-w-[600px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed bg-surface-tint p-4 text-center transition-colors outline-none focus-visible:border-indigo",
          dragging ? "border-indigo bg-indigo-soft" : "border-border",
          busy && "cursor-wait opacity-80"
        )}
      >
        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Partner cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all group-hover:bg-navy/45 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1.5 text-[13px] font-medium text-navy">
                  <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                  Replace
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <ImagePlus className="h-7 w-7 text-text-3" strokeWidth={1.75} />
            <span className="text-[13px] font-medium leading-tight text-text-2">
              Drag cover image here or click to browse
            </span>
            <span className="text-[12px] leading-tight text-text-3">
              PNG, JPG, WebP · 3:1 · max 5MB
            </span>
          </>
        )}

        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/70">
            <Loader2 className="h-6 w-6 animate-spin text-indigo" />
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
          if (file) openCropper(file);
          e.target.value = "";
        }}
      />

      {url && (
        <div className="flex items-center gap-4">
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

      {/* Crop modal */}
      <Dialog
        open={!!objectUrl}
        onOpenChange={(open) => {
          if (!open && !busy) closeCropper();
        }}
      >
        <DialogContent className="max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Crop cover image</DialogTitle>
            <DialogDescription>
              Drag to frame the banner. Locked to a 3:1 aspect ratio.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex max-h-[60vh] justify-center overflow-auto rounded-xl bg-surface-tint p-2">
            {objectUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT}
                keepSelection
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={objectUrl}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-h-[55vh] w-auto"
                />
              </ReactCrop>
            )}
          </div>

          <div className="mt-6 flex flex-row-reverse items-center gap-3">
            <Button
              type="button"
              onClick={handleSaveCrop}
              disabled={busy}
              className="btn-primary-gradient"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                "Save crop"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={closeCropper}
              disabled={busy}
            >
              Cancel
            </Button>
            <button
              type="button"
              disabled={busy}
              onClick={() => pendingFile && upload(pendingFile)}
              className="mr-auto text-[13px] font-medium text-text-2 underline-offset-4 transition-colors hover:text-navy hover:underline disabled:opacity-50"
            >
              Skip crop
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
