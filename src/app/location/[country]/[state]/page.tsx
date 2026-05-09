import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHeader } from "@/components/shared/page-header";
import { EditorialContent } from "@/components/shared/editorial-content";
import { InternalLinks } from "@/components/shared/internal-links";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { DirectoryView } from "@/components/directory/directory-view";
import {
  COUNTRIES,
  CATEGORIES,
  getCountryBySlug,
  getStateBySlug,
} from "@/lib/taxonomy";
import {
  getPartnersByState,
  getPartnersByCity,
} from "@/lib/data/partners";

const SITE_URL = "https://prepparcelpartners.example";

export async function generateStaticParams() {
  const candidates: { country: string; state: string }[] = [];
  for (const country of COUNTRIES) {
    for (const state of country.states) {
      candidates.push({ country: country.slug, state: state.slug });
    }
  }
  const checks = await Promise.all(
    candidates.map(async (c) => ({
      ...c,
      hasPartners: (await getPartnersByState(c.state)).length > 0,
    }))
  );
  return checks.filter((c) => c.hasPartners).map(({ country, state }) => ({ country, state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, state: stateSlug } = await params;
  const country = getCountryBySlug(countrySlug);
  const state = getStateBySlug(stateSlug);
  if (!country || !state)
    return { title: "Location not found — Prep Parcel Partners" };

  const partnerCount = (await getPartnersByState(stateSlug)).length;
  const title = `3PL Partners in ${state.name} — Compare ${partnerCount} Verified Providers | Prep Parcel`;
  const description = `Compare ${partnerCount} verified 3PL warehouses and fulfillment partners serving ${state.name}, ${country.name}. Filter by service, integrations, and certifications.`;
  const url = `${SITE_URL}/location/${countrySlug}/${stateSlug}`;

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ country: string; state: string }>;
}) {
  const { country: countrySlug, state: stateSlug } = await params;
  const country = getCountryBySlug(countrySlug);
  const state = getStateBySlug(stateSlug);
  if (!country || !state) notFound();

  const matched = await getPartnersByState(stateSlug);

  const cityLinkCandidates = await Promise.all(
    state.cities.map(async (city) => {
      const cityMatched = await getPartnersByCity(city.slug);
      return {
        name: city.name,
        href: `/location/${countrySlug}/${stateSlug}/${city.slug}`,
        meta: `${cityMatched.length} partner${cityMatched.length === 1 ? "" : "s"}`,
      };
    })
  );
  const cityLinks = cityLinkCandidates.filter(
    (l) => parseInt(l.meta?.split(" ")[0] ?? "0", 10) > 0
  );

  // Popular [State] services — categories with at least 1 partner
  const categoryLinks = CATEGORIES.map((cat) => {
    const count = matched.filter((p) =>
      p.serviceCategories.includes(cat.slug)
    ).length;
    return { cat, count };
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
    { label: country.name, href: `/location/${countrySlug}` },
    { label: state.name },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Locations", url: `${SITE_URL}/location` },
    { name: country.name, url: `${SITE_URL}/location/${countrySlug}` },
    { name: state.name, url: `${SITE_URL}/location/${countrySlug}/${stateSlug}` },
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`${country.name} · Location`}
          title={`3PL Partners in ${state.name}`}
          description={`${matched.length} verified 3PL partners with operations serving ${state.name} businesses.`}
          breadcrumb={breadcrumbItems}
        />

        {cityLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 pt-16 md:px-8 md:pt-20">
              <InternalLinks
                title={`Browse by city`}
                links={cityLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <DirectoryView
          partners={matched}
          initialFilters={{
            search: "",
            services: new Set(),
            locations: new Set([state.name]),
            integrations: new Set(),
            certifications: new Set(),
            volume: "any",
            rating: "any",
            quickFilters: new Set(),
          }}
          lockedLocations={new Set([state.name])}
          hidePageHeader
          hideQuickFilters
        />

        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title={`3PL fulfillment in ${state.name}`}
              paragraphs={[state.description]}
            />
          </div>
        </div>

        {categoryLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Popular ${state.name} services`}
                links={categoryLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <CtaBanner
          eyebrow="Get matched"
          heading={`Find your next 3PL in ${state.name}`}
          description={`Tell us your service requirements and monthly volume. We'll match you with up to three vetted ${state.name} partners.`}
          primaryLabel="Get matched"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}
