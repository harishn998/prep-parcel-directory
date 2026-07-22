import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { Clock } from "lucide-react";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  PartnerListingForm,
  type PartnerListingFormData,
} from "@/components/partner/partner-listing-form";
import type { PartnerRow } from "@/lib/data/db-types";

export const metadata: Metadata = {
  title: "My listing — Prep Parcel Partners",
  robots: { index: false, follow: false },
};

function rowToFormData(row: PartnerRow): PartnerListingFormData {
  const country = (row.country === "Canada" || row.country === "UK"
    ? row.country
    : "USA") as PartnerListingFormData["country"];
  const countryCode = (row.country_code === "CA" || row.country_code === "GB"
    ? row.country_code
    : "US") as PartnerListingFormData["countryCode"];
  const contactRaw = row.contact as
    | { phone?: string | null; email?: string | null; website?: string | null }
    | null;
  return {
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    location: row.location ?? "",
    country,
    countryCode,
    state: row.state ?? "",
    stateFullName: row.state_full_name ?? "",
    city: row.city,
    cityFullName: row.city_full_name,
    servedStates: row.served_states ?? [],
    yearFounded: row.year_founded,
    employeeCount: row.employee_count,
    minimumOrderVolume: row.minimum_order_volume,
    pricingModel: row.pricing_model,
    responseTime: row.response_time,
    fulfillmentSpeed: row.fulfillment_speed,
    orderAccuracy: row.order_accuracy,
    activeBrandsServed: row.active_brands_served,
    services: row.services ?? [],
    serviceCategories: row.service_categories ?? [],
    integrations: row.integrations ?? [],
    certifications: row.certifications ?? [],
    specialties: row.specialties ?? [],
    contact: contactRaw
      ? {
          phone: contactRaw.phone ?? "",
          email: contactRaw.email ?? "",
          website: contactRaw.website ?? "",
        }
      : null,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

export default async function PartnerListingPage() {
  // Primary gate is the edge middleware (mirrors the /list-your-3pl fix, so a
  // signed-out/soft-nav never mounts this route). These are server-side
  // backstops for direct hits.
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/partner");
  if (profile.role === "admin") redirect("/admin");
  if (profile.role !== "partner") redirect("/");

  // Owner-SELECT policy (0012) lets a partner read their own row even while it
  // is hidden (is_active=false). RLS client — never service_role.
  const supabase = await createSupabaseServerClient();
  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<PartnerRow>();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-[960px] px-6 py-12 md:px-8 md:py-16">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-text md:text-[32px]">
            My listing
          </h1>
          <p className="mt-1.5 max-w-[620px] text-[14px] leading-relaxed text-text-2">
            Keep your directory profile up to date. Publishing, verification, and
            featuring are handled by the Prep Parcel team.
          </p>

          {partner ? (
            <div className="mt-8">
              {partner.is_active === false ? (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                    strokeWidth={2}
                  />
                  <div>
                    <div className="text-[14px] font-semibold text-amber-900">
                      Pending review — not yet public
                    </div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-amber-800">
                      Your listing isn&apos;t live in the directory yet. You can
                      keep editing it here; our team will publish it once
                      it&apos;s approved.
                    </p>
                  </div>
                </div>
              ) : null}

              <PartnerListingForm
                partnerId={partner.id}
                slug={partner.slug}
                isActive={partner.is_active ?? false}
                initial={rowToFormData(partner)}
              />
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-border-soft bg-surface p-8 text-center shadow-sm">
              <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-text">
                You don&apos;t have a listing yet
              </h2>
              <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-relaxed text-text-2">
                Once your 3PL submission is approved, it will show up here for you
                to manage. Haven&apos;t submitted one yet?
              </p>
              <Link
                href="/list-your-3pl"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue px-5 text-[14px] font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-hover"
              >
                List your 3PL
              </Link>
            </div>
          )}
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
