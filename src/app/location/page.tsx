import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHeader } from "@/components/shared/page-header";
import { EditorialContent } from "@/components/shared/editorial-content";
import { InternalLinks } from "@/components/shared/internal-links";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { COUNTRIES, allStates, getCountryForState } from "@/lib/taxonomy";
import {
  locations,
  getStatePartnerCount,
  type Location,
} from "@/lib/sample-data";

const SITE_URL = "https://prepparcelpartners.example";

export const metadata: Metadata = (() => {
  const title =
    "Browse 3PL Partners by Location — USA, Canada, UK | Prep Parcel";
  const description =
    "Find verified 3PL partners across the USA, Canada, and UK — filtered by state, province, or city. Compare warehousing and fulfillment by where your customers ship.";
  const url = `${SITE_URL}/location`;
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
})();

function topCitiesForCountry(countrySlug: string): string[] {
  const country = COUNTRIES.find((c) => c.slug === countrySlug);
  if (!country) return [];
  const out: string[] = [];
  for (const state of country.states) {
    for (const city of state.cities) {
      out.push(city.name);
      if (out.length >= 3) return out;
    }
  }
  return out;
}

export default function LocationIndexPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations" },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Locations", url: `${SITE_URL}/location` },
  ];

  const popularStateLinks = allStates()
    .map((state) => {
      const country = getCountryForState(state.slug);
      const count = getStatePartnerCount(state.slug);
      return { state, country, count };
    })
    .filter((x) => x.count > 0 && x.country)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(({ state, country, count }) => ({
      name: state.name,
      href: `/location/${country!.slug}/${state.slug}`,
      meta: `${count} partner${count === 1 ? "" : "s"}`,
    }));

  const editorialParagraphs = [
    "Where your 3PL operates determines transit time, freight cost, and how forgiving your shipping promise can be. A Midwest or East Coast hub reaches roughly 90% of US households in 2-day ground; West-Coast-only operations cost subscribers an extra day on the East Coast, and that compounds across thousands of orders. For brands above 30,000 monthly orders, splitting between an East and West coast partner cuts a day off transit for half the customer base — usually worth the operational complexity.",
    "Beyond transit, location dictates specialization. Long Beach and Houston anchor port-adjacent FBA prep and container drayage. Atlanta, Dallas, and Reno cluster cold-chain operations around food and beverage flows. Toronto and the Greater Toronto Area service most Canadian DTC and cross-border into the US. London and the Midlands handle UK distribution and EU corridor work. Pick a region that matches the operational shape of your business, not just the cheapest square footage.",
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Locations"
          title="Browse 3PL Partners by Location"
          description="Find verified 3PL partners across the USA, Canada, and UK — filtered by state, province, or city."
          breadcrumb={breadcrumbItems}
        />

        <div className="bg-background">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {locations.map((location) => (
                <CountryCard key={location.slug} location={location} />
              ))}
            </div>
          </div>
        </div>

        {popularStateLinks.length > 0 && (
          <div className="border-t border-border-soft bg-surface">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title="Popular states and provinces"
                links={popularStateLinks}
                columns={4}
              />
            </div>
          </div>
        )}

        <div className="border-t border-border-soft bg-background">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title="Why location matters for 3PL selection"
              paragraphs={editorialParagraphs}
            />
          </div>
        </div>

        <CtaBanner
          eyebrow="Get matched"
          heading="Find a 3PL where your customers ship"
          description="Tell us your target regions and monthly volume. We'll match you with up to three vetted partners with operations in the right markets."
          primaryLabel="Get matched"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}

function CountryCard({ location }: { location: Location }) {
  const topCities = topCitiesForCountry(location.slug);
  return (
    <Link
      href={`/location/${location.slug}`}
      className="lift-card group relative flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface p-8"
    >
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-navy text-white">
        <span
          className="text-[20px] font-semibold tracking-[-0.02em]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {location.flag}
        </span>
      </div>

      <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-text">
        {location.country}
      </h3>

      <div className="mt-3 flex items-baseline gap-4 text-[14px] text-text-2">
        <span>
          <span data-numeric className="text-text">
            {location.partnerCount}
          </span>{" "}
          partners
        </span>
        <span className="h-1 w-1 rounded-full bg-text-3" />
        <span>
          <span data-numeric className="text-text">
            {location.cities}
          </span>{" "}
          cities
        </span>
      </div>

      {topCities.length > 0 && (
        <p className="mt-3 text-[13px] text-text-3">
          {topCities.join(" · ")}
        </p>
      )}

      <span className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-blue transition-colors duration-200 group-hover:text-navy">
        Explore
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </Link>
  );
}
