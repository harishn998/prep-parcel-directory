import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DirectorySearchView } from "@/components/directory/directory-search-view";
import {
  getDirectoryPartners,
  getDirectoryFacets,
} from "@/lib/data/partners";
import type { DirectoryQuery, DirectorySort } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Browse 3PL & Fulfillment Partners — Prep Parcel Partners",
  description:
    "Browse vetted 3PL warehouses and fulfillment partners across the USA, Canada, and the UK. Filter by service, location, and more.",
};

const SORTS: ReadonlySet<DirectorySort> = new Set([
  "relevance",
  "rating",
  "name",
  "reviews",
]);

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function parseArray(v: string | string[] | undefined): string[] | undefined {
  if (Array.isArray(v)) {
    const out = v.filter(Boolean);
    return out.length > 0 ? out : undefined;
  }
  if (typeof v === "string" && v.length > 0) {
    const out = v.split(",").map((s) => s.trim()).filter(Boolean);
    return out.length > 0 ? out : undefined;
  }
  return undefined;
}

function parseSort(v: string | string[] | undefined): DirectorySort | undefined {
  const s = firstValue(v);
  if (s && SORTS.has(s as DirectorySort)) return s as DirectorySort;
  return undefined;
}

function parsePage(v: string | string[] | undefined): number {
  const s = firstValue(v);
  if (!s) return 1;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const query: DirectoryQuery = {
    q: firstValue(sp.q),
    services: parseArray(sp.services),
    country: firstValue(sp.country),
    state: firstValue(sp.state),
    city: firstValue(sp.city),
    sort: parseSort(sp.sort),
    page: parsePage(sp.page),
    perPage: 12,
  };

  const [result, facets] = await Promise.all([
    getDirectoryPartners(query),
    getDirectoryFacets(query),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DirectorySearchView
          partners={result.partners}
          total={result.total}
          page={result.page}
          perPage={result.perPage}
          facets={facets}
        />
      </main>
      <Footer />
    </>
  );
}
