import Link from "next/link";
import { Inbox } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { relativeTime } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export const metadata = { title: "Submissions" };

interface SubmissionRow {
  id: string;
  type: string;
  status: string;
  created_at: string;
  submitted_by: string;
  payload: { name?: string } | null;
}

export default async function SubmissionsQueuePage() {
  const supabase = await createSupabaseServerClient();
  const { data: subs } = await supabase
    .from("partner_submissions")
    .select("id, type, status, created_at, submitted_by, payload")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const rows = (subs as SubmissionRow[] | null) ?? [];

  // Submitter emails (second query — mirrors loadRecentActivity in the overview).
  const emailById = new Map<string, string>();
  const ids = Array.from(new Set(rows.map((r) => r.submitted_by)));
  if (ids.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", ids);
    for (const p of (profs as { id: string; email: string }[] | null) ?? []) {
      emailById.set(p.id, p.email);
    }
  }

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-8">
      <AdminPageHeader
        title="Submissions"
        description="3PLs that submitted themselves for review. Approve to create a hidden listing, then publish it."
      />

      <div className="mt-6">
        {rows.length === 0 ? (
          <AdminEmptyState
            icon={<Inbox className="h-4 w-4" strokeWidth={2} />}
            title="No pending submissions"
            description="New self-listings from the “List your 3PL” form will appear here for review."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-text">
                      {r.payload?.name?.trim() || "Untitled submission"}
                    </TableCell>
                    <TableCell className="text-[13px] text-text-2">
                      {emailById.get(r.submitted_by) ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex h-5 items-center rounded-full bg-background px-2 text-[11px] font-medium uppercase tracking-wide text-text-2 ring-1 ring-border">
                        {r.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px] text-text-2">
                      {relativeTime(r.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/submissions/${r.id}`}
                        className="inline-flex h-8 items-center rounded-md bg-blue px-3 text-[13px] font-medium text-white transition-colors hover:bg-blue-hover"
                      >
                        Review
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
