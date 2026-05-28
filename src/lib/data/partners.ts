import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { mapPartnerRow } from "./mappers";
import type {
  Partner,
  CountryName,
  DirectoryQuery,
  DirectoryResult,
  DirectoryFacets,
} from "./types";
import type { PartnerRow, ReviewRow, WarehouseRow } from "./db-types";
import { categories, locations } from "@/lib/static-data";

/**
 * Public anon-key Supabase client. No cookies, no session — safe to call
 * from `generateStaticParams` and other build-time contexts. The RLS
 * policy in 0001_init.sql exposes active partners and their child rows
 * to any caller, so this client has exactly the read access we need.
 *
 * Phase 1E (writes) will use a cookie-aware client for authenticated
 * operations.
 */
function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set.");
  if (!anon) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const out = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = out.get(k);
    if (bucket) bucket.push(item);
    else out.set(k, [item]);
  }
  return out;
}

function sortPrimaryFirst(rows: WarehouseRow[]): WarehouseRow[] {
  return [...rows].sort((a, b) => {
    if (a.is_primary === b.is_primary) return 0;
    return a.is_primary ? -1 : 1;
  });
}

export const getAllPartners = cache(async (): Promise<Partner[]> => {
  const supabase = createPublicClient();
  const [partnersRes, reviewsRes, warehousesRes] = await Promise.all([
    supabase.from("partners").select("*").eq("is_active", true),
    supabase.from("reviews").select("*"),
    supabase.from("warehouses").select("*"),
  ]);
  if (partnersRes.error) throw partnersRes.error;
  if (reviewsRes.error) throw reviewsRes.error;
  if (warehousesRes.error) throw warehousesRes.error;

  const reviewsByPartner = groupBy(
    (reviewsRes.data ?? []) as ReviewRow[],
    (r) => r.partner_id
  );
  const whByPartner = groupBy(
    (warehousesRes.data ?? []) as WarehouseRow[],
    (w) => w.partner_id
  );

  return (partnersRes.data ?? []).map((p) =>
    mapPartnerRow(
      p,
      reviewsByPartner.get(p.id) ?? [],
      sortPrimaryFirst(whByPartner.get(p.id) ?? [])
    )
  );
});

export async function getAllPartnerSlugs(): Promise<string[]> {
  return (await getAllPartners()).map((p) => p.slug);
}

export async function getPartnerBySlug(
  slug: string
): Promise<Partner | null> {
  return (await getAllPartners()).find((p) => p.slug === slug) ?? null;
}

export async function getPartnersByCategory(
  categorySlug: string
): Promise<Partner[]> {
  return (await getAllPartners()).filter((p) =>
    p.serviceCategories.includes(categorySlug)
  );
}

export async function getPartnersByCountry(
  country: CountryName
): Promise<Partner[]> {
  return (await getAllPartners()).filter((p) => p.country === country);
}

export async function getPartnersByState(
  stateSlug: string
): Promise<Partner[]> {
  return (await getAllPartners()).filter((p) =>
    p.servedStates.includes(stateSlug)
  );
}

export async function getPartnersByCity(
  citySlug: string
): Promise<Partner[]> {
  return (await getAllPartners()).filter((p) => p.city === citySlug);
}

export async function getPartnersByCategoryAndState(
  categorySlug: string,
  stateSlug: string
): Promise<Partner[]> {
  return (await getAllPartners()).filter(
    (p) =>
      p.serviceCategories.includes(categorySlug) &&
      p.servedStates.includes(stateSlug)
  );
}

export async function getStatePartnerCount(
  stateSlug: string
): Promise<number> {
  return (await getPartnersByState(stateSlug)).length;
}

export async function getCityPartnerCount(citySlug: string): Promise<number> {
  return (await getPartnersByCity(citySlug)).length;
}

export async function getCategoryPartnerCount(
  categorySlug: string
): Promise<number> {
  return (await getPartnersByCategory(categorySlug)).length;
}

export async function getSimilarPartners(
  slug: string,
  count = 3
): Promise<Partner[]> {
  const all = await getAllPartners();
  const target = all.find((p) => p.slug === slug);
  if (!target) return all.slice(0, count);
  const targetServices = new Set(target.services);
  const overlapScore = (p: Partner) =>
    p.services.filter((s) => targetServices.has(s)).length;
  return all
    .filter((p) => p.slug !== slug)
    .sort((a, b) => overlapScore(b) - overlapScore(a))
    .slice(0, count);
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2A: server-side directory search + filters + facets
// ─────────────────────────────────────────────────────────────────────────────

const DIRECTORY_PER_PAGE_DEFAULT = 12;
const DIRECTORY_PER_PAGE_MAX = 60;

function normaliseQuery(query: DirectoryQuery) {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const perPage = Math.max(
    1,
    Math.min(DIRECTORY_PER_PAGE_MAX, Math.floor(query.perPage ?? DIRECTORY_PER_PAGE_DEFAULT))
  );
  return {
    q: query.q?.trim() || undefined,
    services:
      query.services && query.services.length > 0 ? query.services : undefined,
    country: query.country || undefined,
    state: query.state || undefined,
    city: query.city || undefined,
    sort: query.sort ?? "relevance",
    page,
    perPage,
  };
}

export const getDirectoryPartners = cache(
  async (query: DirectoryQuery): Promise<DirectoryResult> => {
    const n = normaliseQuery(query);
    const supabase = createPublicClient();

    let q = supabase
      .from("partners")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    if (n.q) {
      q = q.textSearch("search_vector", n.q, {
        type: "websearch",
        config: "english",
      });
    }
    if (n.services) q = q.overlaps("service_categories", n.services);
    if (n.country) q = q.eq("country_code", n.country);
    if (n.state) q = q.contains("served_states", [n.state]);
    if (n.city) q = q.eq("city", n.city);

    switch (n.sort) {
      case "rating":
        q = q
          .order("rating", { ascending: false, nullsFirst: false })
          .order("review_count", { ascending: false });
        break;
      case "name":
        q = q.order("name", { ascending: true });
        break;
      case "reviews":
        q = q
          .order("review_count", { ascending: false })
          .order("rating", { ascending: false, nullsFirst: false });
        break;
      case "relevance":
      default:
        // Supabase JS doesn't expose ts_rank() in .order(). Featured-first
        // then rating is a sensible default; tsvector match-set ordering is
        // already filtered by textSearch above when q is present.
        q = q
          .order("is_featured", { ascending: false })
          .order("rating", { ascending: false, nullsFirst: false });
        break;
    }

    // Cumulative pagination (preserves Load More UX): page=N returns rows
    // 0..(N*perPage − 1). `total` (from { count: "exact" }) is independent
    // of the range window.
    q = q.range(0, n.page * n.perPage - 1);

    const partnersRes = await q;
    if (partnersRes.error) throw partnersRes.error;
    const rows = (partnersRes.data ?? []) as PartnerRow[];
    const total = partnersRes.count ?? rows.length;

    const ids = rows.map((r) => r.id);
    let reviews: ReviewRow[] = [];
    let warehouses: WarehouseRow[] = [];
    if (ids.length > 0) {
      const [reviewsRes, warehousesRes] = await Promise.all([
        supabase.from("reviews").select("*").in("partner_id", ids),
        supabase.from("warehouses").select("*").in("partner_id", ids),
      ]);
      if (reviewsRes.error) throw reviewsRes.error;
      if (warehousesRes.error) throw warehousesRes.error;
      reviews = (reviewsRes.data ?? []) as ReviewRow[];
      warehouses = (warehousesRes.data ?? []) as WarehouseRow[];
    }

    const reviewsByPartner = groupBy(reviews, (r) => r.partner_id);
    const whByPartner = groupBy(warehouses, (w) => w.partner_id);

    const partners = rows.map((p) =>
      mapPartnerRow(
        p,
        reviewsByPartner.get(p.id) ?? [],
        sortPrimaryFirst(whByPartner.get(p.id) ?? [])
      )
    );

    return { partners, total, page: n.page, perPage: n.perPage };
  }
);

interface FacetRpcRow {
  value: string;
  count: number;
}
interface FacetRpcResponse {
  services: FacetRpcRow[];
  countries: FacetRpcRow[];
}

export const getDirectoryFacets = cache(
  async (query: DirectoryQuery): Promise<DirectoryFacets> => {
    const n = normaliseQuery(query);
    const supabase = createPublicClient();

    const { data, error } = await supabase.rpc("directory_facets", {
      p_q: n.q ?? null,
      p_services: n.services ?? null,
      p_country_code: n.country ?? null,
      p_state_slug: n.state ?? null,
      p_city_slug: n.city ?? null,
    });
    if (error) throw error;

    const raw = (data ?? { services: [], countries: [] }) as FacetRpcResponse;

    const serviceLabel = new Map(categories.map((c) => [c.slug, c.name]));
    const countryLabel = new Map(locations.map((l) => [l.flag, l.country]));

    return {
      services: (raw.services ?? []).map((r) => ({
        value: r.value,
        label: serviceLabel.get(r.value) ?? r.value,
        count: Number(r.count),
      })),
      countries: (raw.countries ?? []).map((r) => ({
        value: r.value,
        label: countryLabel.get(r.value) ?? r.value,
        count: Number(r.count),
      })),
    };
  }
);
