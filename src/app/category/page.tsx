import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  Truck,
  Snowflake,
  Warehouse,
  RotateCcw,
  Boxes,
  Globe,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/shared/cta-banner";
import { PageHeader } from "@/components/shared/page-header";
import { EditorialContent } from "@/components/shared/editorial-content";
import { BreadcrumbSchema } from "@/components/shared/breadcrumb-schema";
import {
  categories,
  type Category,
  type CategoryIconKey,
} from "@/lib/static-data";

const SITE_URL = "https://prepparcelpartners.example";

const iconMap: Record<CategoryIconKey, typeof Package> = {
  package: Package,
  truck: Truck,
  snowflake: Snowflake,
  warehouse: Warehouse,
  rotate: RotateCcw,
  boxes: Boxes,
  globe: Globe,
  scale: Scale,
};

export const metadata: Metadata = (() => {
  const title =
    "Browse 3PL Service Categories — All Verified Partner Types | Prep Parcel";
  const description =
    "Compare vetted 3PL partners across 8 service categories — from FBA prep to cold chain storage and cross-border fulfillment. Filter by what you actually need.";
  const url = `${SITE_URL}/category`;
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

export default function CategoryIndexPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories" },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", url: SITE_URL },
    { name: "Categories", url: `${SITE_URL}/category` },
  ];

  const editorialParagraphs = [
    "The right 3PL category depends on where the operational work actually happens. DTC fulfillment partners optimize for same-day pick-and-pack with same-day cutoffs, branded unboxing, and 2-day ground reach. FBA prep operators run a parallel discipline focused on FNSKU labeling, polybagging, and direct injection into Amazon FCs in 24–48 hours. B2B freight partners run an entirely different muscle: routing-guide compliance, EDI, and case-conformance pack for retail. Pick the category that matches your dominant volume — generalist 3PLs that claim all of the above usually compromise on the one that matters most to you.",
    "Cold storage, cross-border, kitting, returns, and subscription box fulfillment are specialized lanes that deserve their own evaluation. A good cold-chain 3PL is FDA registered with redundant power and dedicated cold-chain freight. A good cross-border partner has consolidated DDP entries and broker relationships in your target corridor. Subscription boxes need proven monthly cadence capacity. When in doubt, prioritize the category your volume concentrates in over a single 3PL that does everything thinly.",
  ];

  return (
    <>
      <Navbar />
      <BreadcrumbSchema items={breadcrumbSchemaItems} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Service categories"
          title="Browse 3PL Services by Category"
          description="Find vetted 3PL partners by service type — from FBA prep to cold chain storage to cross-border fulfillment."
          breadcrumb={breadcrumbItems}
        />

        <div className="bg-background">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-soft bg-surface">
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
            <EditorialContent
              title="How to choose a 3PL category"
              paragraphs={editorialParagraphs}
            />
          </div>
        </div>

        <CtaBanner
          eyebrow="Get matched"
          heading="Not sure which category fits your operation?"
          description="Tell us your monthly volume, channels, and product type. We'll match you with up to three vetted partners across the right service categories."
          primaryLabel="Get matched"
          secondaryLabel="Talk to us"
        />
      </main>
      <Footer />
    </>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.iconKey];
  return (
    <Link
      href={`/category/${category.slug}`}
      className="lift-card group relative flex flex-col rounded-xl border border-border-soft bg-surface p-7"
    >
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-navy transition-colors duration-200 group-hover:bg-blue group-hover:text-white">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>

      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-text">
        {category.name}
      </h3>
      <p className="mt-1.5 text-[13px] font-medium text-text-3">
        <span data-numeric>{category.partnerCount}</span> partners
      </p>
      <p className="mt-3 text-[14px] leading-[1.55] text-text-2">
        {category.description}
      </p>

      <ArrowUpRight
        className="absolute right-6 top-6 h-4 w-4 text-text-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue group-hover:opacity-100"
        strokeWidth={2}
      />
    </Link>
  );
}
