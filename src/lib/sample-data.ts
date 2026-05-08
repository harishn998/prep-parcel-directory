export type Partner = {
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: string[];
  verified: boolean;
  description: string;
  logoPlaceholder: string;
};

export type Category = {
  name: string;
  slug: string;
  description: string;
  partnerCount: number;
  iconKey: CategoryIconKey;
};

export type CategoryIconKey =
  | "package"
  | "truck"
  | "snowflake"
  | "warehouse"
  | "rotate"
  | "boxes"
  | "globe"
  | "scale";

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

export const partners: Partner[] = [
  {
    name: "Northstar Fulfillment",
    slug: "northstar-fulfillment",
    location: "Toronto, ON",
    rating: 4.9,
    reviewCount: 247,
    services: ["FBA Prep", "DTC Fulfillment", "Returns"],
    verified: true,
    description:
      "Premium FBA prep and DTC fulfillment for ambitious DTC brands shipping across North America. Same-day cutoffs and dedicated account managers.",
    logoPlaceholder: "NF",
  },
  {
    name: "Meridian Logistics",
    slug: "meridian-logistics",
    location: "Dallas, TX",
    rating: 4.8,
    reviewCount: 189,
    services: ["B2B Freight", "Kitting", "Cold Storage"],
    verified: true,
    description:
      "Enterprise-grade 3PL with 12 distribution centers across the US. Specialists in complex kitting and temperature-controlled freight.",
    logoPlaceholder: "ML",
  },
  {
    name: "Harbor Fulfillment Group",
    slug: "harbor-fulfillment-group",
    location: "Long Beach, CA",
    rating: 4.7,
    reviewCount: 312,
    services: ["FBA Prep", "Container Drayage", "DTC Fulfillment"],
    verified: true,
    description:
      "West Coast port-adjacent fulfillment. Direct drayage from Long Beach and LA terminals plus integrated FBA prep on the same campus.",
    logoPlaceholder: "HF",
  },
  {
    name: "Ironclad 3PL",
    slug: "ironclad-3pl",
    location: "Columbus, OH",
    rating: 4.9,
    reviewCount: 156,
    services: ["DTC Fulfillment", "Returns", "Subscription Boxes"],
    verified: true,
    description:
      "Midwest fulfillment hub built for subscription brands and high-velocity DTC. Two-day ground reaches 92% of US households.",
    logoPlaceholder: "IC",
  },
  {
    name: "Saltwater Supply Co.",
    slug: "saltwater-supply-co",
    location: "Brooklyn, NY",
    rating: 4.6,
    reviewCount: 98,
    services: ["DTC Fulfillment", "Kitting", "Apparel"],
    verified: true,
    description:
      "Boutique fulfillment for premium apparel and lifestyle brands. White-glove kitting, hand-finished packaging, and custom inserts.",
    logoPlaceholder: "SS",
  },
  {
    name: "Beacon Warehousing",
    slug: "beacon-warehousing",
    location: "Manchester, UK",
    rating: 4.8,
    reviewCount: 174,
    services: ["DTC Fulfillment", "FBA Prep", "EU Distribution"],
    verified: true,
    description:
      "UK and EU fulfillment under one roof. IOSS-compliant cross-border shipping and Amazon UK FBA prep with same-day inbound receiving.",
    logoPlaceholder: "BW",
  },
];

export const categories: Category[] = [
  {
    name: "FBA Prep",
    slug: "fba-prep",
    description: "Amazon-compliant prep, labeling, and inbound logistics.",
    partnerCount: 142,
    iconKey: "package",
  },
  {
    name: "DTC Fulfillment",
    slug: "dtc-fulfillment",
    description: "Pick, pack, and ship for direct-to-consumer brands.",
    partnerCount: 218,
    iconKey: "truck",
  },
  {
    name: "Cold Storage",
    slug: "cold-storage",
    description: "Refrigerated and frozen storage with temp-controlled freight.",
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
    slug: "returns",
    description: "Reverse logistics, inspection, and reconditioning.",
    partnerCount: 67,
    iconKey: "rotate",
  },
  {
    name: "Kitting",
    slug: "kitting",
    description: "Custom assembly, bundling, and subscription box builds.",
    partnerCount: 91,
    iconKey: "boxes",
  },
  {
    name: "Cross-Border",
    slug: "cross-border",
    description: "International shipping, customs, and duty management.",
    partnerCount: 52,
    iconKey: "globe",
  },
  {
    name: "Heavy & Bulky",
    slug: "heavy-bulky",
    description: "Oversized item fulfillment and white-glove delivery.",
    partnerCount: 29,
    iconKey: "scale",
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
