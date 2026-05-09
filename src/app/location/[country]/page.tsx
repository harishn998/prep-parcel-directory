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
} from "@/lib/taxonomy";
import {
  getPartnersByCountry,
  getPartnersByState,
} from "@/lib/sample-data";

const SITE_URL = "https://prepparcelpartners.example";

export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  if (!country) return { title: "Country not found — Prep Parcel Partners" };

  const partnerCount = getPartnersByCountry(country.fullName).length;
  const stateCount = country.states.length;
  const title = `3PL & Fulfillment Partners in ${country.name} — Compare ${partnerCount} Verified Providers | Prep Parcel`;
  const description = `Browse ${partnerCount} vetted 3PL warehouses and fulfillment partners across ${country.name}. Filter by service, state, integrations, and more. ${stateCount} states covered.`;
  const url = `${SITE_URL}/location/${countrySlug}`;

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

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  if (!country) notFound();

  const matched = getPartnersByCountry(country.fullName);
  const avgRating =
    matched.length > 0
      ? matched.reduce((sum, p) => sum + p.rating, 0) / matched.length
      : 0;

  const stateLinks = country.states
    .map((state) => {
      const stateMatched = getPartnersByState(state.slug);
      const topServiceSlugs: string[] = [];
      const seen = new Set<string>();
      for (const p of stateMatched) {
        for (const sc of p.serviceCategories) {
          if (!seen.has(sc) && topServiceSlugs.length < 2) {
            seen.add(sc);
            topServiceSlugs.push(sc);
          }
        }
      }
      const topServices = topServiceSlugs
        .map((slug) => CATEGORIES.find((c) => c.slug === slug)?.name)
        .filter((s): s is string => Boolean(s))
        .join(" · ");
      return {
        name: state.name,
        href: `/location/${countrySlug}/${state.slug}`,
        meta: `${stateMatched.length} partner${stateMatched.length === 1 ? "" : "s"}`,
        description: topServices ? `Top services: ${topServices}` : undefined,
      };
    })
    .filter((link) => {
      const m = parseInt(link.meta?.split(" ")[0] ?? "0", 10);
      return m > 0;
    });

  // "Popular categories in [Country]" — top 6 categories by partner count in this country
  const categoryCounts = CATEGORIES.map((cat) => ({
    cat,
    count: matched.filter((p) => p.serviceCategories.includes(cat.slug)).length,
  }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  const popularCategoryLinks = categoryCounts.slice(0, 6).map(({ cat, count }) => ({
    name: cat.name,
    href: `/category/${cat.slug}`,
    meta: `${count} partner${count === 1 ? "" : "s"}`,
  }));

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/location" },
    { label: country.name },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Locations", url: `${SITE_URL}/location` },
    { name: country.name, url: `${SITE_URL}/location/${countrySlug}` },
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Location"
          title={`3PL & Fulfillment Partners in ${country.name}`}
          description={`Compare ${matched.length} vetted 3PL partners with operations across ${country.states.length} ${country.name === "USA" ? "states" : country.name === "Canada" ? "provinces" : "regions"}.`}
          meta={`${matched.length} partners · ${country.states.length} ${country.name === "USA" ? "states" : country.name === "Canada" ? "provinces" : "regions"} · Avg rating ${avgRating.toFixed(1)}`}
          breadcrumb={breadcrumbItems}
        />

        {stateLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 pt-16 md:px-8 md:pt-20">
              <InternalLinks
                title={`Browse by ${country.name === "USA" ? "state" : country.name === "Canada" ? "province" : "region"}`}
                links={stateLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <DirectoryView
          partners={matched}
          hidePageHeader
          hideQuickFilters
        />

        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title={`3PL landscape in ${country.name}`}
              paragraphs={country.description}
            />
          </div>
        </div>

        {popularCategoryLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Popular categories in ${country.name}`}
                links={popularCategoryLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <CtaBanner
          eyebrow="Get matched"
          heading={`Find your next 3PL in ${country.name}`}
          description="Tell us your category, monthly volume, and target region. We'll match you with up to three vetted partners and make warm intros."
          primaryLabel="Get matched"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}
