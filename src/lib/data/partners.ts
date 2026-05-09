import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { mapPartnerRow } from "./mappers";
import type { Partner, CountryName } from "./types";
import type { ReviewRow, WarehouseRow } from "./db-types";

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
