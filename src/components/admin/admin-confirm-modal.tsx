"use client";

import { useState, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AdminConfirmModalProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmTone?: "default" | "destructive";
  /** When set, user must type this exact string to enable the confirm button. */
  requireConfirmText?: string;
  onConfirm: () => void | Promise<void>;
}

export function AdminConfirmModal({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmTone = "default",
  requireConfirmText,
  onConfirm,
}: AdminConfirmModalProps) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);

  const requiresType = Boolean(requireConfirmText);
  const canConfirm = !requiresType || typed.trim() === requireConfirmText;

  const confirmClass =
    confirmTone === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50"
      : "bg-blue text-white hover:bg-blue-hover disabled:bg-blue/50";

  async function handleConfirm() {
    if (!canConfirm || busy) return;
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
      setTyped("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTyped("");
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement<Record<string, unknown>>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {requiresType ? (
          <div className="mt-4 flex flex-col gap-1.5">
            <label
              htmlFor="confirm-typed"
              className="text-[12px] font-medium text-text-2"
            >
              Type{" "}
              <span className="font-mono text-text">{requireConfirmText}</span>{" "}
              to confirm
            </label>
            <Input
              id="confirm-typed"
              autoComplete="off"
              autoFocus
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
            />
          </div>
        ) : null}

        <DialogFooter>
          <button
            type="button"
            disabled={!canConfirm || busy}
            onClick={handleConfirm}
            className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-[13px] font-medium transition-colors disabled:cursor-not-allowed ${confirmClass}`}
          >
            {busy ? "Working…" : confirmText}
          </button>
          <DialogClose
            render={
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-4 text-[13px] font-medium text-text transition-colors hover:bg-background"
              >
                {cancelText}
              </button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
