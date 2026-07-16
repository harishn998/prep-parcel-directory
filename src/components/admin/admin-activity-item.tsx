import * as React from "react";
import {
  Plus,
  Pencil,
  EyeOff,
  Eye,
  ShieldCheck,
  ShieldOff,
  Star,
  StarOff,
  Warehouse,
  Trash2,
  UserCog,
  Activity,
  Inbox,
  Check,
  X,
} from "lucide-react";

import { relativeTime } from "@/lib/utils";
import type { AdminActionType } from "@/lib/actions/admin/_audit";

const ICON_MAP: Record<AdminActionType, typeof Activity> = {
  partner_created: Plus,
  partner_updated: Pencil,
  partner_deactivated: EyeOff,
  partner_reactivated: Eye,
  partner_verified: ShieldCheck,
  partner_unverified: ShieldOff,
  partner_featured: Star,
  partner_unfeatured: StarOff,
  warehouse_created: Warehouse,
  warehouse_updated: Warehouse,
  warehouse_deleted: Trash2,
  user_role_changed: UserCog,
  partner_submission_created: Inbox,
  partner_submission_approved: Check,
  partner_submission_rejected: X,
};

function actionDescription(
  type: AdminActionType,
  metadata: Record<string, unknown> | null
): string {
  const m = metadata ?? {};
  switch (type) {
    case "partner_created":
      return `Created partner ${(m.name as string) ?? (m.slug as string) ?? ""}`.trim();
    case "partner_updated": {
      const fields = m.fields as string[] | undefined;
      return fields && fields.length > 0
        ? `Updated partner (${fields.join(", ")})`
        : "Updated partner";
    }
    case "partner_deactivated":
      return "Deactivated partner";
    case "partner_reactivated":
      return "Reactivated partner";
    case "partner_verified":
      return "Marked partner as verified";
    case "partner_unverified":
      return "Removed partner verification";
    case "partner_featured":
      return "Featured partner";
    case "partner_unfeatured":
      return "Unfeatured partner";
    case "warehouse_created":
      return `Added warehouse${m.city ? ` (${m.city})` : ""}`;
    case "warehouse_updated":
      return "Updated warehouse";
    case "warehouse_deleted":
      return "Deleted warehouse";
    case "user_role_changed":
      return `Changed role of ${m.userEmail ?? "user"} (${m.from} → ${m.to})`;
    case "partner_submission_created":
      return `New listing submission${m.name ? ` — ${m.name}` : ""}`;
    case "partner_submission_approved":
      return `Approved listing submission${m.name ? ` — ${m.name}` : ""}`;
    case "partner_submission_rejected":
      return `Rejected listing submission${m.name ? ` — ${m.name}` : ""}`;
  }
}

export interface ActivityEntry {
  id: string;
  action_type: AdminActionType;
  admin_name: string | null;
  admin_email: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export function AdminActivityItem({ entry }: { entry: ActivityEntry }) {
  const Icon = ICON_MAP[entry.action_type] ?? Activity;
  const description = actionDescription(entry.action_type, entry.metadata);
  const name = entry.admin_name?.trim() || entry.admin_email;

  return (
    <li className="relative flex gap-3 py-3 pl-8">
      <span
        aria-hidden
        className="absolute left-[14px] top-0 h-full w-px bg-border"
      />
      <span className="absolute left-[7px] top-3 flex h-4 w-4 items-center justify-center rounded-full bg-surface ring-1 ring-border">
        <Icon className="h-2.5 w-2.5 text-text-2" strokeWidth={2.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-text">
          <span className="font-medium">{name}</span>
          <span className="text-text-2"> · {description}</span>
        </div>
        <div className="mt-0.5 text-[12px] text-text-3">
          {relativeTime(entry.created_at)}
        </div>
      </div>
    </li>
  );
}
