"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  Star,
  EyeOff,
  Eye,
  ExternalLink,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  togglePartnerVerified,
  togglePartnerFeatured,
  deactivatePartner,
  reactivatePartner,
} from "@/lib/actions/admin/partners";

interface Props {
  partner: {
    id: string;
    slug: string;
    verified: boolean;
    is_featured: boolean;
    is_active: boolean;
  };
}

export function PartnerRowActions({ partner }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function runAction(fn: () => Promise<{ success: boolean; error?: string }>, optimisticLabel: string) {
    if (busy) return;
    setBusy(true);
    startTransition(async () => {
      const r = await fn();
      setBusy(false);
      if (r.success) {
        toast.success(optimisticLabel);
        router.refresh();
      } else {
        toast.error(r.error ?? "Action failed");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open actions"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-2 outline-none transition-colors hover:bg-background hover:text-text focus-visible:ring-2 focus-visible:ring-blue"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          render={
            <Link href={`/admin/partners/${partner.id}`}>
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Link>
          }
        />
        <DropdownMenuItem
          onClick={() =>
            runAction(
              () => togglePartnerVerified(partner.id, partner.verified),
              partner.verified ? "Verification removed" : "Marked as verified"
            )
          }
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>
            {partner.verified ? "Remove verified" : "Mark as verified"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            runAction(
              () => togglePartnerFeatured(partner.id, partner.is_featured),
              partner.is_featured ? "Unfeatured" : "Featured"
            )
          }
        >
          <Star className="h-3.5 w-3.5" />
          <span>{partner.is_featured ? "Unfeature" : "Feature"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            partner.is_active
              ? runAction(
                  () => deactivatePartner(partner.id),
                  "Partner deactivated"
                )
              : runAction(
                  () => reactivatePartner(partner.id),
                  "Partner reactivated"
                )
          }
          variant={partner.is_active ? "destructive" : "default"}
        >
          {partner.is_active ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              <span>Reactivate</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link
              href={`/directory/${partner.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View on site</span>
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
