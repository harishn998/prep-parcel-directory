"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldX, ShieldCheck, Lock } from "lucide-react";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { AdminConfirmModal } from "@/components/admin/admin-confirm-modal";
import { updateUserRole } from "@/lib/actions/admin/users";

interface Props {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    role: "user" | "admin";
  };
  selfId: string;
}

export function UserRowActions({ user, selfId }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const isSelf = user.id === selfId;

  function changeRole(newRole: "user" | "admin") {
    if (busy) return;
    setBusy(true);
    startTransition(async () => {
      const r = await updateUserRole({ userId: user.id, newRole });
      setBusy(false);
      if (r.success) {
        toast.success(`Role changed to ${newRole}`);
        router.refresh();
      } else {
        toast.error(r.error ?? "Failed");
      }
    });
  }

  if (isSelf) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[12px] font-medium text-text-3"
              >
                <Lock className="h-3 w-3" strokeWidth={2} />
                You
              </button>
            }
          />
          <TooltipContent>Cannot modify your own role</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (user.role === "admin") {
    return (
      <AdminConfirmModal
        title="Remove admin access?"
        description={`Remove admin access from ${user.full_name?.trim() || user.email}? They will lose ability to manage the system.`}
        confirmText="Demote to user"
        confirmTone="destructive"
        requireConfirmText={user.email}
        onConfirm={() => changeRole("user")}
        trigger={
          <button
            type="button"
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-text transition-colors hover:bg-background"
          >
            <ShieldX className="h-3 w-3" strokeWidth={2} />
            Demote
          </button>
        }
      />
    );
  }

  return (
    <AdminConfirmModal
      title="Grant admin access?"
      description={`Grant admin access to ${user.full_name?.trim() || user.email}? Admins can manage all partners and users.`}
      confirmText="Promote to admin"
      requireConfirmText={user.email}
      onConfirm={() => changeRole("admin")}
      trigger={
        <button
          type="button"
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-text transition-colors hover:bg-background"
        >
          <ShieldCheck className="h-3 w-3" strokeWidth={2} />
          Promote
        </button>
      }
    />
  );
}
