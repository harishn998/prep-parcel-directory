import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

/**
 * Confirmation / pending state for the "List your 3PL" flow. Shared by the
 * post-submit success screen and the "you already have one in review" case.
 * Presentational only — no "use client", so it renders in both the server page
 * and the client form.
 */
export function ListingPendingPanel({
  justSubmitted = false,
  companyName = null,
}: {
  justSubmitted?: boolean;
  companyName?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue/10 text-blue">
        {justSubmitted ? (
          <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
        ) : (
          <Clock className="h-6 w-6" strokeWidth={2} />
        )}
      </div>

      <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.01em] text-text">
        {justSubmitted ? "Submitted — pending review" : "Your listing is in review"}
      </h2>

      <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-[1.6] text-text-2">
        {companyName ? (
          <>
            Thanks — <span className="font-medium text-text">{companyName}</span> is
            in our review queue.
          </>
        ) : (
          <>Thanks — your 3PL is in our review queue.</>
        )}{" "}
        Our team vets every listing before it goes live. We&apos;ll email you at
        your account address once it&apos;s approved and published to the directory.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/directory"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue px-4 text-[14px] font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-hover"
        >
          Browse the directory
        </Link>
        <Link
          href="/account"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-[14px] font-medium text-text transition-colors duration-200 hover:bg-background"
        >
          Account settings
        </Link>
      </div>
    </div>
  );
}
