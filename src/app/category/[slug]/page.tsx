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
  CATEGORY_SLUG_TO_DISPLAY_NAME,
  getCategoryBySlug,
  allStates,
  getCountryForState,
} from "@/lib/taxonomy";
import {
  getPartnersByCategory,
  getPartnersByCategoryAndState,
} from "@/lib/sample-data";

const SITE_URL = "https://prepparcelpartners.example";

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found — Prep Parcel Partners" };

  const partnerCount = getPartnersByCategory(slug).length;
  const title = `${category.name} — Compare ${partnerCount} Verified 3PL Partners | Prep Parcel`;
  const description = `Compare ${partnerCount} vetted ${category.name.toLowerCase()} partners on Prep Parcel. ${category.description}`;
  const url = `${SITE_URL}/category/${slug}`;

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const matched = getPartnersByCategory(slug);
  const stateCounts = new Map<string, number>();
  for (const p of matched) {
    for (const s of p.servedStates) {
      stateCounts.set(s, (stateCounts.get(s) ?? 0) + 1);
    }
  }
  const totalLocationsServed = stateCounts.size;
  const avgRating =
    matched.length > 0
      ? matched.reduce((sum, p) => sum + p.rating, 0) / matched.length
      : 0;

  // Top 5 states by partner count (only states that exist in taxonomy)
  const validStates = new Set(allStates().map((s) => s.slug));
  const topStateLinks = Array.from(stateCounts.entries())
    .filter(([slug]) => validStates.has(slug))
    .filter(([slug]) => getPartnersByCategoryAndState(category.slug, slug).length > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([stateSlug, count]) => {
      const state = allStates().find((s) => s.slug === stateSlug)!;
      const country = getCountryForState(stateSlug)!;
      return {
        name: `${category.name} in ${state.name}`,
        href: `/category/${category.slug}/${country.slug}/${state.slug}`,
        meta: `${count} partner${count === 1 ? "" : "s"}`,
      };
    });

  const lockedDisplayName = CATEGORY_SLUG_TO_DISPLAY_NAME[category.slug];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/category" },
    { label: category.name },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Categories", url: `${SITE_URL}/category` },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Service category"
          title={`${category.name} — Verified 3PL Partners`}
          description={category.description}
          meta={`${matched.length} verified partners · Avg rating ${avgRating.toFixed(1)} · ${totalLocationsServed} locations served`}
          breadcrumb={breadcrumbItems}
        />

        <DirectoryView
          partners={matched}
          initialFilters={{
            search: "",
            services: lockedDisplayName
              ? new Set([lockedDisplayName])
              : new Set(),
            locations: new Set(),
            integrations: new Set(),
            certifications: new Set(),
            volume: "any",
            rating: "any",
            quickFilters: new Set(),
          }}
          lockedServices={
            lockedDisplayName ? new Set([lockedDisplayName]) : undefined
          }
          hidePageHeader
          hideQuickFilters
        />

        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title={`About ${category.name}`}
              paragraphs={category.longDescription}
            />
          </div>
        </div>

        {topStateLinks.length > 0 && (
          <div className="bg-background">
            <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
              <InternalLinks
                title={`Top locations for ${category.name}`}
                links={topStateLinks}
                columns={3}
              />
            </div>
          </div>
        )}

        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <FaqAccordion faqs={category.faqs} />
          </div>
        </div>

        <CtaBanner
          eyebrow="Get matched"
          heading={`Need help choosing a ${category.name} partner?`}
          description={`Tell us your monthly volume and key requirements. We'll match you with up to three vetted ${category.name.toLowerCase()} partners and intro you directly.`}
          primaryLabel="Get matched"
          secondaryLabel="Browse all"
        />
      </main>
      <Footer />
    </>
  );
}
