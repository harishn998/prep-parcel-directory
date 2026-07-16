import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/session";
import { isSiteNoindex } from "@/lib/seo/noindex";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AccountForm } from "@/components/account/account-form";
import pkg from "../../../../package.json";

export const metadata = { title: "Settings" };

/** Derive the Supabase project ref (the `<ref>` in `https://<ref>.supabase.co`). */
function supabaseProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "Not configured";
  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0];
    return ref && ref !== "localhost" ? ref : host;
  } catch {
    return "Not configured";
  }
}

function SystemRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[13px] text-text-2">{label}</span>
      <span className="font-mono text-[13px] text-text">{value}</span>
    </div>
  );
}

export default async function AdminSettingsPage() {
  // Gated by the admin layout (requireAdmin-equivalent redirect); re-read the
  // profile here so the account form has data to edit.
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/login?redirect=/admin/settings");
  }

  const noindex = isSiteNoindex();

  return (
    <div className="mx-auto max-w-[840px] px-6 py-8">
      <AdminPageHeader
        title="Settings"
        description="Manage your own account and review system configuration."
      />

      <section className="mt-6">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-3">
          Your account
        </h2>
        <AccountForm profile={profile} showSignOut={false} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-text-3">
          System
        </h2>
        <div className="rounded-xl border border-border bg-surface px-6 py-2">
          <SystemRow
            label="Search indexing (NOINDEX)"
            value={noindex ? "Blocked" : "Allowed"}
          />
          <div className="border-t border-border" />
          <SystemRow label="App version" value={`v${pkg.version}`} />
          <div className="border-t border-border" />
          <SystemRow label="Supabase project" value={supabaseProjectRef()} />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-text-3">
          Indexing is controlled by the{" "}
          <code className="font-mono">NEXT_PUBLIC_SITE_NOINDEX</code>{" "}
          environment variable and can only be changed via deployment
          configuration — there is no toggle here.
        </p>
      </section>
    </div>
  );
}
