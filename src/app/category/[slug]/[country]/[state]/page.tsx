import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHeader } from "@/components/shared/page-header";
import { EditorialContent } from "@/components/shared/editorial-content";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { InternalLinks } from "@/components/shared/internal-links";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import { DirectoryView } from "@/components/directory/directory-view";
import {
  CATEGORIES,
  COUNTRIES,
  CATEGORY_SLUG_TO_DISPLAY_NAME,
  getCategoryBySlug,
  getCountryBySlug,
  getStateBySlug,
  getCountryForState,
  getCategoryStateContext,
  getStateSpecificFaqs,
} from "@/lib/taxonomy";
import { getPartnersByCategoryAndState } from "@/lib/sample-data";

const SITE_URL = "https://prepparcelpartners.example";

export async function generateStaticParams() {
  const params: { slug: string; country: string; state: string }[] = [];
  for (const cat of CATEGORIES) {
    for (const country of COUNTRIES) {
      for (const state of country.states) {
        if (getPartnersByCategoryAndState(cat.slug, state.slug).length > 0) {
          params.push({
            slug: cat.slug,
            country: country.slug,
            state: state.slug,
          });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; country: string; state: string }>;
}): Promise<Metadata> {
  const { slug, country: countrySlug, state: stateSlug } = await params;
  const category = getCategoryBySlug(slug);
  const country = getCountryBySlug(countrySlug);
  const state = getStateBySlug(stateSlug);
  if (!category || !country || !state) {
    return { title: "Page not found — Prep Parcel Partners" };
  }
  const partnerCount = getPartnersByCategoryAndState(slug, stateSlug).length;
  const title = `${category.name} in ${state.name} — Compare ${partnerCount} Verified ${country.name} Providers | Prep Parcel`;
  const description = `Compare ${partnerCount} verified ${category.name.toLowerCase()} partners serving ${state.name}, ${country.name} businesses. Filter by integrations, certifications, and minimum order volume.`;
  const url = `${SITE_URL}/category/${slug}/${countrySlug}/${stateSlug}`;
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

export default async function CategoryStatePage({
  params,
}: {
  params: Promise<{ slug: string; country: string; state: string }>;
}) {
  const { slug, country: countrySlug, state: stateSlug } = await params;
  const category = getCategoryBySlug(slug);
  const country = getCountryBySlug(countrySlug);
  const state = getStateBySlug(stateSlug);
  if (!category || !country || !state) notFound();

  // Verify country↔state alignment
  if (getCountryForState(stateSlug)?.slug !== countrySlug) notFound();

  const matched = getPartnersByCategoryAndState(slug, stateSlug);
  if (matched.length === 0) notFound();

  // Editorial paragraphs
  const stateContext =
    getCategoryStateContext(slug, stateSlug) ?? state.description;
  const editorialParagraphs: string[] = [
    category.longDescription[0],
    stateContext,
  ];

  // FAQs: 3 from category + 2 state-specific
  const combinedFaqs = [
    ...category.faqs.slice(0, 3),
    ...getStateSpecificFaqs(category.name, state.name),
  ];

  // Other states for this category
  const otherStateLinks = COUNTRIES.flatMap((c) =>
    c.states
      .filter((s) => s.slug !== stateSlug)
      .map((s) => {
        const count = getPartnersByCategoryAndState(slug, s.slug).length;
        return { slug: s.slug, name: s.name, country: c, count };
      })
      .filter((x) => x.count > 0)
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(({ name, slug: sSlug, country: c, count }) => ({
      name: `${category.name} in ${name}`,
      href: `/category/${slug}/${c.slug}/${sSlug}`,
      meta: `${count} partner${count === 1 ? "" : "s"}`,
    }));

  // Other [State] services
  const otherCategoryLinks = CATEGORIES.filter((c) => c.slug !== slug)
    .map((c) => {
      const count = getPartnersByCategoryAndState(c.slug, stateSlug).length;
      return { cat: c, count };
    })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(({ cat, count }) => ({
      name: `${cat.name} in ${state.name}`,
      href: `/category/${cat.slug}/${countrySlug}/${stateSlug}`,
      meta: `${count} partner${count === 1 ? "" : "s"}`,
    }));

  const lockedDisplayName = CATEGORY_SLUG_TO_DISPLAY_NAME[category.slug];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/category" },
    { label: category.name, href: `/category/${slug}` },
    { label: country.name, href: `/location/${countrySlug}` },
    { label: state.name },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Categories", url: `${SITE_URL}/category` },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
    { name: country.name, url: `${SITE_URL}/location/${countrySlug}` },
    {
      name: state.name,
      url: `${SITE_URL}/category/${slug}/${countrySlug}/${stateSlug}`,
    },
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`${country.name} · Service in location`}
          title={`${category.name} in ${state.name} — ${country.name}`}
          description={`Compare ${matched.length} verified ${category.name.toLowerCase()} partners serving ${state.name} businesses.`}
          breadcrumb={breadcrumbItems}
        />

        <DirectoryView
          partners={matched}
          initialFilters={{
            search: "",
            services: lockedDisplayName
              ? new Set([lockedDisplayName])
              : new Set(),
            locations: new Set([state.name]),
            integrations: new Set(),
            certifications: new Set(),
            volume: "any",
            rating: "any",
            quickFilters: new Set(),
          }}
          lockedServices={
            lockedDisplayName ? new Set([lockedDisplayName]) : undefined
          }
          lockedLocations={new Set([state.name])}
          hidePageHeader
          hideQuickFilters
        />

        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title={`${category.name} in ${state.name}`}
              paragraphs={editorialParagraphs}
            />
          </div>
        </div>

        <div className="bg-background">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <FaqAccordion
              faqs={combinedFaqs}
              title={`Frequently asked questions about ${category.name} in ${state.name}`}
            />
          </div>
        </div>

        {otherStateLinks.length > 0 && (
          <div className="border-t border-border-soft bg-surface">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Other states for ${category.name}`}
                links={otherStateLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        {otherCategoryLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Other ${state.name} services`}
                links={otherCategoryLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <CtaBanner
          eyebrow="Get matched"
          heading={`Find your ${category.name} partner in ${state.name}`}
          description={`Tell us your monthly volume and we'll match you with up to three vetted ${category.name.toLowerCase()} partners serving ${state.name}.`}
          primaryLabel="Get matched"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}
