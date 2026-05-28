/**
 * Static UI data: categories, locations, filter options, sort options, etc.
 * Decoupled from partner data (which lives in Supabase, fetched via
 * src/lib/data/partners.ts).
 */

import type { CoverGradient } from "./data/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CategoryIconKey =
  | "package"
  | "truck"
  | "snowflake"
  | "warehouse"
  | "rotate"
  | "boxes"
  | "globe"
  | "scale";

export type Category = {
  name: string;
  slug: string;
  description: string;
  partnerCount: number;
  iconKey: CategoryIconKey;
};

export type Location = {
  country: string;
  slug: string;
  flag: string;
  partnerCount: number;
  cities: number;
};

export type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

export type ServiceFilter = { name: string; count: number };

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  {
    name: "FBA Prep",
    slug: "fba-prep-services",
    description: "Amazon FBA preparation, FNSKU labeling, and inbound.",
    partnerCount: 142,
    iconKey: "package",
  },
  {
    name: "DTC Fulfillment",
    slug: "dtc-fulfillment",
    description: "Pick, pack, and ship for Shopify, BigCommerce, and beyond.",
    partnerCount: 218,
    iconKey: "truck",
  },
  {
    name: "Cold Storage",
    slug: "cold-storage",
    description: "Refrigerated and frozen storage with temperature control.",
    partnerCount: 38,
    iconKey: "snowflake",
  },
  {
    name: "B2B Freight",
    slug: "b2b-freight",
    description: "LTL, FTL, and retailer-compliant pallet shipping.",
    partnerCount: 84,
    iconKey: "warehouse",
  },
  {
    name: "Returns",
    slug: "returns-management",
    description: "Reverse logistics, inspection, and reconditioning.",
    partnerCount: 67,
    iconKey: "rotate",
  },
  {
    name: "Kitting",
    slug: "kitting-and-assembly",
    description: "Custom assembly, bundling, and subscription box builds.",
    partnerCount: 91,
    iconKey: "boxes",
  },
  {
    name: "Cross-Border",
    slug: "cross-border-fulfillment",
    description: "International shipping, customs, and duty management.",
    partnerCount: 52,
    iconKey: "globe",
  },
  {
    name: "Subscription Boxes",
    slug: "subscription-box-fulfillment",
    description: "Monthly cadence assembly, custom dunnage, and inserts.",
    partnerCount: 54,
    iconKey: "boxes",
  },
];

export const locations: Location[] = [
  {
    country: "United States",
    slug: "usa",
    flag: "US",
    partnerCount: 312,
    cities: 38,
  },
  {
    country: "Canada",
    slug: "canada",
    flag: "CA",
    partnerCount: 94,
    cities: 9,
  },
  {
    country: "United Kingdom",
    slug: "uk",
    flag: "GB",
    partnerCount: 67,
    cities: 7,
  },
];

export const stats: Stat[] = [
  { label: "Vetted Partners", value: 500, suffix: "+" },
  { label: "Cities Covered", value: 50, suffix: "+" },
  { label: "Verified Reviews", value: 12400, suffix: "+" },
  { label: "Response Rate", value: 98, suffix: "%" },
];

export const popularSearchChips = [
  "FBA Prep",
  "DTC Fulfillment",
  "Cold Storage",
  "B2B Freight",
  "Returns",
  "Kitting",
];

// Phase 2A: homepage hero pills routing to /directory?services=<slug>.
// Slugs match `categories[].slug` so they line up with the service_categories
// column the directory query filters on.
export const popularSearchPills: { label: string; slug: string }[] = [
  { label: "FBA Prep", slug: "fba-prep-services" },
  { label: "DTC Fulfillment", slug: "dtc-fulfillment" },
  { label: "Cold Storage", slug: "cold-storage" },
  { label: "B2B Freight", slug: "b2b-freight" },
  { label: "Returns", slug: "returns-management" },
  { label: "Kitting", slug: "kitting-and-assembly" },
];

// Quick-filter chips for the directory page (8 items)
export const directoryQuickFilters = [
  "FBA Prep",
  "DTC Fulfillment",
  "Cold Storage",
  "B2B Freight",
  "Returns",
  "Kitting",
  "Subscription Boxes",
  "Cross-Border",
];

export const serviceFilters: ServiceFilter[] = [
  { name: "FBA Prep", count: 142 },
  { name: "DTC Fulfillment", count: 218 },
  { name: "Cold Storage", count: 38 },
  { name: "B2B Freight", count: 84 },
  { name: "Returns", count: 67 },
  { name: "Kitting", count: 91 },
  { name: "Subscription Boxes", count: 54 },
  { name: "Cross-Border", count: 52 },
  { name: "Heavy & Bulky", count: 29 },
  { name: "Container Drayage", count: 41 },
];

export const integrationFilters = [
  "Shopify",
  "Amazon",
  "WooCommerce",
  "BigCommerce",
  "NetSuite",
  "Magento",
];

export const certificationFilters = [
  "ISO 9001",
  "FDA Registered",
  "SOC 2",
  "GMP",
  "C-TPAT",
];

export const usStates = [
  "California",
  "Texas",
  "New York",
  "Florida",
  "Illinois",
  "Pennsylvania",
  "Georgia",
  "Ohio",
];

export const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function coverGradientCss(g: CoverGradient): string {
  switch (g) {
    case "navy-blue":
      return "linear-gradient(135deg, #0c1e3e 0%, #1d4ed8 100%)";
    case "navy-amber":
      return "linear-gradient(135deg, #0c1e3e 0%, #f59e0b 100%)";
    case "blue-indigo":
      return "linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)";
  }
}
