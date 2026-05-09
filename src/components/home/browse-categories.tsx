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
import type { Category, CategoryIconKey } from "@/lib/sample-data";
import { categories } from "@/lib/sample-data";

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

export function BrowseCategories() {
  return (
    <section
      id="categories"
      className="section bg-background"
      aria-labelledby="browse-categories-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <header className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-blue">
              Browse by category
            </p>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-text md:text-[44px]">
              Every fulfillment service,
              <br className="hidden sm:inline" /> in one directory.
            </h2>
          </div>
          <p className="max-w-md text-[16px] leading-[1.65] text-text-2">
            From Amazon FBA prep to cold storage and cross-border freight —
            filter partners by what you actually need.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
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
