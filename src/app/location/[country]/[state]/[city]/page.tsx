import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHeader } from "@/components/shared/page-header";
import { EditorialContent } from "@/components/shared/editorial-content";
import { InternalLinks } from "@/components/shared/internal-links";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { PartnerCard } from "@/components/home/partner-card";
import { MapPin } from "lucide-react";
import {
  COUNTRIES,
  CATEGORIES,
  getCityBySlug,
  getCountryBySlug,
} from "@/lib/taxonomy";
import { getPartnersByCity, getPartnersByState } from "@/lib/data/partners";

const SITE_URL = "https://prepparcelpartners.example";

export async function generateStaticParams() {
  const candidates: { country: string; state: string; city: string }[] = [];
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      for (const city of state.cities) {
        candidates.push({
          country: country.slug,
          state: state.slug,
          city: city.slug,
        });
      }
    }
  }
  const checks = await Promise.all(
    candidates.map(async (c) => ({
      ...c,
      hasPartners: (await getPartnersByCity(c.city)).length > 0,
    }))
  );

  // Resilience guard: only emit a city param that fully resolves in the
  // taxonomy AND whose (country, state, city) all align. Skip-and-log the rest.
  const skipped: string[] = [];
  const params = checks
    .filter((c) => c.hasPartners)
    .filter((c) => {
      const resolved = getCityBySlug(c.city);
      const ok =
        !!resolved &&
        resolved.country.slug === c.country &&
        resolved.state.slug === c.state;
      if (!ok) skipped.push(`${c.country}/${c.state}/${c.city}`);
      return ok;
    })
    .map(({ country, state, city }) => ({ country, state, city }));

  if (skipped.length > 0) {
    console.warn(
      `[location/[country]/[state]/[city]] skipped ${skipped.length} unmappable param(s): ${skipped.join(", ")}`
    );
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; state: string; city: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, state: stateSlug, city: citySlug } =
    await params;
  const found = getCityBySlug(citySlug);
  if (!found || found.country.slug !== countrySlug || found.state.slug !== stateSlug) {
    return { title: "City not found — Prep Parcel Partners" };
  }
  const { city, state } = found;
  const partnerCount = (await getPartnersByCity(citySlug)).length;
  const title = `3PL & Fulfillment Partners in ${city.name} — Compare ${partnerCount} Verified Providers | Prep Parcel`;
  const description = `Compare ${partnerCount} verified 3PL warehouses in ${city.name}, ${state.name}. Local fulfillment, FBA prep, returns, and DTC operations.`;
  const url = `${SITE_URL}/location/${countrySlug}/${stateSlug}/${citySlug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Prep Parcel Partners",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; state: string; city: string }>;
}) {
  const { country: countrySlug, state: stateSlug, city: citySlug } =
    await params;
  const country = getCountryBySlug(countrySlug);
  const found = getCityBySlug(citySlug);
  if (
    !country ||
    !found ||
    found.country.slug !== countrySlug ||
    found.state.slug !== stateSlug
  ) {
    notFound();
  }
  const { city, state } = found;
  const matched = await getPartnersByCity(citySlug);

  // Other cities in the same state with partners
  const otherCityCandidates = await Promise.all(
    state.cities
      .filter((c) => c.slug !== city.slug)
      .map(async (c) => {
        const count = (await getPartnersByCity(c.slug)).length;
        return {
          name: c.name,
          href: `/location/${countrySlug}/${stateSlug}/${c.slug}`,
          meta: `${count} partner${count === 1 ? "" : "s"}`,
        };
      })
  );
  const otherCityLinks = otherCityCandidates.filter(
    (l) => parseInt(l.meta?.split(" ")[0] ?? "0", 10) > 0
  );

  // Popular services serving the city — fall back to state-wide combos
  const stateMatched = await getPartnersByState(stateSlug);
  const popularServiceLinks = CATEGORIES.map((cat) => {
    const stateCount = stateMatched.filter((p) =>
      p.serviceCategories.includes(cat.slug)
    ).length;
    return { cat, count: stateCount };
  })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(({ cat, count }) => ({
      name: `${cat.name} in ${state.name}`,
      href: `/category/${cat.slug}/${countrySlug}/${stateSlug}`,
      meta: `${count} partner${count === 1 ? "" : "s"}`,
    }));

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/location" },
    { label: country!.name, href: `/location/${countrySlug}` },
    {
      label: state.name,
      href: `/location/${countrySlug}/${stateSlug}`,
    },
    { label: city.name },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Locations", url: `${SITE_URL}/location` },
    { name: country!.name, url: `${SITE_URL}/location/${countrySlug}` },
    {
      name: state.name,
      url: `${SITE_URL}/location/${countrySlug}/${stateSlug}`,
    },
    {
      name: city.name,
      url: `${SITE_URL}/location/${countrySlug}/${stateSlug}/${citySlug}`,
    },
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`${state.name} · ${country!.name}`}
          title={`3PL & Fulfillment Partners in ${city.name}`}
          description={`${matched.length} verified 3PL partner${matched.length === 1 ? "" : "s"} headquartered in ${city.name}.`}
          breadcrumb={breadcrumbItems}
        />

        {/* Map placeholder */}
        <div className="border-b border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-8 md:py-14">
            <div
              className="relative flex h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-soft"
              style={{
                background:
                  "linear-gradient(135deg, #0c1e3e 0%, #1d4ed8 60%, #3b82f6 100%)",
              }}
              aria-hidden
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.25) 0%, transparent 35%)",
                }}
              />
              <div className="relative flex flex-col items-center gap-3 text-white">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                  <MapPin className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="text-[14px] font-medium uppercase tracking-[0.08em] text-white/80">
                  {city.name} · Map coming soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Partner grid (no sidebar) */}
        <div className="bg-background">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <h2 className="mb-8 text-[24px] font-semibold tracking-[-0.02em] text-text md:text-[28px]">
              {matched.length} 3PL partner{matched.length === 1 ? "" : "s"} in{" "}
              {city.name}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {matched.map((p) => (
                <PartnerCard key={p.slug} partner={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Editorial */}
        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title={`3PL fulfillment in ${city.name}`}
              paragraphs={[city.description]}
            />
          </div>
        </div>

        {/* Other cities */}
        {otherCityLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Other cities in ${state.name}`}
                links={otherCityLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        {/* Popular services in city */}
        {popularServiceLinks.length > 0 && (
          <div className="border-t border-border-soft bg-surface">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Popular services serving ${city.name}`}
                links={popularServiceLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <CtaBanner
          eyebrow="Get matched"
          heading={`Find your next 3PL in ${city.name}`}
          description={`Tell us your service requirements and we'll match you with vetted ${city.name} 3PL partners.`}
          primaryLabel="Get matched"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}
