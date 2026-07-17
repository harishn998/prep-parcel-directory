"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { PartnerCreateForm } from "@/components/admin/partner-create-form";
import { approveSubmission, rejectSubmission } from "@/lib/actions/admin/submissions";
import type { PartnerFormData } from "@/lib/validation/partner";

type Mode = "idle" | "approving" | "rejecting";

export function SubmissionReview({
  submissionId,
  defaults,
}: {
  submissionId: string;
  defaults: Partial<PartnerFormData>;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function onReject() {
    if (busy) return;
    if (note.trim().length < 4) {
      toast.error("Add a short reason for the rejection.");
      return;
    }
    setBusy(true);
    const r = await rejectSubmission(submissionId, note.trim());
    setBusy(false);
    if (r.success) {
      toast.success("Submission rejected");
      router.refresh();
    } else {
      toast.error(r.error ?? "Could not reject submission");
    }
  }

  if (mode === "approving") {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text">
            Approve → create listing
          </h2>
          <button
            type="button"
            onClick={() => setMode("idle")}
            className="text-[13px] font-medium text-text-2 hover:text-text"
          >
            Cancel
          </button>
        </div>
        <p className="text-[13px] text-text-2">
          Prefilled from the submission. Fill in the remaining details, then save
          — the listing is created <strong>hidden</strong> and you publish it as a
          separate step.
        </p>
        <PartnerCreateForm
          defaults={defaults}
          submitAction={(form) => approveSubmission(submissionId, form)}
          submitLabel="Approve & create listing"
          submittingLabel="Approving…"
          successMessage="Approved — listing created (hidden). Review, then publish."
        />
      </div>
    );
  }

  if (mode === "rejecting") {
    return (
      <div className="grid gap-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-[16px] font-semibold text-text">Reject submission</h2>
        <AdminFormField
          label="Reason"
          htmlFor="reject-note"
          required
          hint="Saved on the submission for the record."
        >
          <Textarea
            id="reject-note"
            rows={4}
            value={note}
            maxLength={1000}
            placeholder="e.g. Not a fulfillment provider / insufficient detail to verify."
            onChange={(e) => setNote(e.target.value)}
          />
        </AdminFormField>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setMode("idle")}
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-[14px] font-medium text-text transition-colors hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={busy}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-red-600 px-4 text-[14px] font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            <X className="h-4 w-4" strokeWidth={2} />
            {busy ? "Rejecting…" : "Confirm rejection"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setMode("approving")}
        className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-blue px-5 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
      >
        <Check className="h-4 w-4" strokeWidth={2.2} />
        Approve
      </button>
      <button
        type="button"
        onClick={() => setMode("rejecting")}
        className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-surface px-5 text-[14px] font-medium text-text transition-colors hover:bg-background"
      >
        <X className="h-4 w-4" strokeWidth={2} />
        Reject
      </button>
    </div>
  );
}
