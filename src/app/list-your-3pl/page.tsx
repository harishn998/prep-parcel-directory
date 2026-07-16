import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CATEGORIES, COUNTRIES } from "@/lib/taxonomy";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  ListYour3plForm,
  type ServiceOption,
  type LocationGroup,
} from "@/components/listing/list-your-3pl-form";
import { ListingPendingPanel } from "@/components/listing/listing-pending-panel";

export const metadata: Metadata = {
  title: "List your 3PL — Prep Parcel Partners",
  description:
    "Submit your 3PL or fulfillment company for review and inclusion in the Prep Parcel directory.",
  // Auth-gated utility page — keep it out of the index (bots hit the redirect).
  robots: { index: false, follow: false },
};

// Derive option lists server-side so the heavy taxonomy module stays out of
// the client bundle.
const serviceOptions: ServiceOption[] = CATEGORIES.map((c) => ({
  slug: c.slug,
  name: c.name,
}));
const locationGroups: LocationGroup[] = COUNTRIES.map((c) => ({
  country: c.name,
  states: c.states.map((s) => ({ slug: s.slug, name: s.name })),
}));

export default async function ListYour3plPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login?redirect=/list-your-3pl");
  }

  // One-in-flight: if the user already has a pending submission, show that
  // instead of a blank form (read via their own RLS-readable rows).
  const supabase = await createSupabaseServerClient();
  const { data: pending } = await supabase
    .from("partner_submissions")
    .select("id, payload")
    .eq("submitted_by", profile.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const pendingName =
    pending && typeof pending.payload === "object" && pending.payload !== null
      ? ((pending.payload as { name?: string }).name ?? null)
      : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-[760px] px-6 py-12 md:px-8 md:py-16">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-text md:text-[32px]">
            List your 3PL
          </h1>
          <p className="mt-1.5 max-w-[560px] text-[14px] leading-relaxed text-text-2">
            Tell us about your fulfillment company. Every listing is reviewed by
            our team before it goes live in the directory.
          </p>

          <div className="mt-8">
            {pending ? (
              <ListingPendingPanel companyName={pendingName} />
            ) : (
              <ListYour3plForm
                defaultEmail={profile.email}
                serviceOptions={serviceOptions}
                locationGroups={locationGroups}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        theme="light"
        richColors
        closeButton
        offset={80}
      />
    </>
  );
}
