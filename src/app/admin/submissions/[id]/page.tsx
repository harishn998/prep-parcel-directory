import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { relativeTime, slugify } from "@/lib/utils";
import {
  getCountryForState,
  getStateBySlug,
  getCategoryBySlug,
} from "@/lib/taxonomy";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SubmissionReview } from "@/components/admin/submission-review";
import type { PartnerFormData } from "@/lib/validation/partner";

export const metadata = { title: "Review submission" };

interface SubmissionPayload {
  name?: string;
  description?: string;
  contact?: { email?: string | null; website?: string | null } | null;
  servedStates?: string[];
  serviceCategories?: string[];
}

interface SubmissionRow {
  id: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  submitted_by: string;
  reviewed_by: string | null;
  review_note: string | null;
  target_partner_id: string | null;
  payload: SubmissionPayload | null;
}

const COUNTRY_CODE: Record<
  PartnerFormData["country"],
  PartnerFormData["countryCode"]
> = { USA: "US", Canada: "CA", UK: "GB" };

/**
 * payload → prefilled PartnerFormData. Country/countryCode/state are derived
 * from the FIRST served-state slug via the taxonomy (servedStates can be
 * mixed-country; the admin sets the true primary in the form). services display
 * names are derived from the selected category slugs.
 */
function deriveApproveDefaults(payload: SubmissionPayload): Partial<PartnerFormData> {
  const name = payload.name ?? "";
  const servedStates = Array.isArray(payload.servedStates) ? payload.servedStates : [];
  const serviceCategories = Array.isArray(payload.serviceCategories)
    ? payload.serviceCategories
    : [];
  const primary = servedStates[0];
  const country = primary ? getCountryForState(primary) : undefined;
  const state = primary ? getStateBySlug(primary) : undefined;
  const countryFull = (country?.fullName ?? "USA") as PartnerFormData["country"];
  const contact = payload.contact ?? {};

  return {
    name,
    slug: slugify(name),
    description: payload.description ?? null,
    location: state?.name ?? "",
    country: countryFull,
    countryCode: COUNTRY_CODE[countryFull],
    state: state?.slug ?? "",
    stateFullName: state?.name ?? "",
    servedStates,
    serviceCategories,
    services: serviceCategories
      .map((s) => getCategoryBySlug(s)?.name)
      .filter((n): n is string => Boolean(n)),
    contact: {
      phone: null,
      email: contact.email ?? null,
      website: contact.website ?? null,
    },
    verified: false,
    isFeatured: false,
    isActive: false, // created hidden; publish is a separate step
  };
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
      <span className="text-[13px] text-text-3">{label}</span>
      <span className="text-[13px] text-text">{value}</span>
    </div>
  );
}

export default async function SubmissionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: sub } = await supabase
    .from("partner_submissions")
    .select(
      "id, type, status, created_at, submitted_by, reviewed_by, review_note, target_partner_id, payload"
    )
    .eq("id", id)
    .maybeSingle();

  if (!sub) notFound();
  const submission = sub as SubmissionRow;
  const payload = submission.payload ?? {};

  const { data: submitter } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", submission.submitted_by)
    .maybeSingle();

  // For an approved submission, resolve the created partner for the publish link.
  let partnerSlug: string | null = null;
  let partnerActive = false;
  if (submission.target_partner_id) {
    const { data: p } = await supabase
      .from("partners")
      .select("slug, is_active")
      .eq("id", submission.target_partner_id)
      .maybeSingle();
    partnerSlug = (p?.slug as string | undefined) ?? null;
    partnerActive = Boolean(p?.is_active);
  }

  const categoryNames = (payload.serviceCategories ?? []).map(
    (s) => getCategoryBySlug(s)?.name ?? s
  );
  const stateNames = (payload.servedStates ?? []).map((s) => {
    const st = getStateBySlug(s);
    const c = getCountryForState(s);
    return st ? `${st.name}${c ? ` (${c.name})` : ""}` : s;
  });

  const defaults = deriveApproveDefaults(payload);

  const statusBadge =
    submission.status === "pending" ? (
      <span className="inline-flex h-6 items-center rounded-full bg-amber-100 px-2.5 text-[12px] font-medium text-amber-800">
        Pending
      </span>
    ) : submission.status === "approved" ? (
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-emerald-100 px-2.5 text-[12px] font-medium text-emerald-800">
        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
      </span>
    ) : (
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-red-100 px-2.5 text-[12px] font-medium text-red-800">
        <XCircle className="h-3.5 w-3.5" /> Rejected
      </span>
    );

  return (
    <div className="mx-auto max-w-[860px] px-6 py-8">
      <Link
        href="/admin/submissions"
        className="text-[13px] font-medium text-text-2 transition-colors hover:text-text"
      >
        ← Back to submissions
      </Link>

      <div className="mt-3">
        <AdminPageHeader
          title={payload.name?.trim() || "Untitled submission"}
          description="Self-submitted 3PL listing awaiting review."
          actions={statusBadge}
        />
      </div>

      {/* Payload summary */}
      <div className="mt-6 rounded-xl border border-border bg-surface px-6 py-3">
        <SummaryRow label="Submitter" value={submitter?.email ?? "—"} />
        <div className="border-t border-border" />
        <SummaryRow label="Submitter role" value={submitter?.role ?? "—"} />
        <div className="border-t border-border" />
        <SummaryRow label="Submitted" value={relativeTime(submission.created_at)} />
        <div className="border-t border-border" />
        <SummaryRow
          label="Website"
          value={
            payload.contact?.website ? (
              <a
                href={payload.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {payload.contact.website}
              </a>
            ) : (
              "—"
            )
          }
        />
        <div className="border-t border-border" />
        <SummaryRow label="Contact email" value={payload.contact?.email ?? "—"} />
        <div className="border-t border-border" />
        <SummaryRow
          label="Services"
          value={categoryNames.length ? categoryNames.join(", ") : "—"}
        />
        <div className="border-t border-border" />
        <SummaryRow
          label="Locations"
          value={stateNames.length ? stateNames.join(", ") : "—"}
        />
        <div className="border-t border-border" />
        <SummaryRow
          label="Description"
          value={
            <span className="whitespace-pre-wrap">{payload.description ?? "—"}</span>
          }
        />
      </div>

      {/* Actions / status */}
      <div className="mt-8">
        {submission.status === "pending" ? (
          <SubmissionReview submissionId={submission.id} defaults={defaults} />
        ) : submission.status === "approved" ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h2 className="text-[16px] font-semibold text-text">
              Approved — listing created
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-text-2">
              A hidden partner listing was created and the submitter was promoted.{" "}
              {partnerActive
                ? "It is published and live in the directory."
                : "It is still hidden — review and publish it from the partner page."}
            </p>
            {submission.target_partner_id ? (
              <Link
                href={`/admin/partners/${submission.target_partner_id}`}
                className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg bg-blue px-4 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
                {partnerActive ? "View listing" : "Review & publish listing"}
              </Link>
            ) : null}
            {partnerSlug && partnerActive ? (
              <Link
                href={`/directory/${partnerSlug}`}
                className="ml-2 mt-4 inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-[14px] font-medium text-text transition-colors hover:bg-background"
              >
                View public page
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-6">
            <h2 className="text-[16px] font-semibold text-text">Rejected</h2>
            {submission.review_note ? (
              <p className="mt-1.5 whitespace-pre-wrap text-[14px] leading-relaxed text-text-2">
                {submission.review_note}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
