import type {
  Partner,
  Review,
  WarehouseLocation,
  CoverGradient,
  CountryName,
} from "./types";
import type { PartnerRow, ReviewRow, WarehouseRow } from "./db-types";

const COVER_GRADIENTS: ReadonlySet<CoverGradient> = new Set([
  "navy-blue",
  "navy-amber",
  "blue-indigo",
]);

const COUNTRY_NAMES: ReadonlySet<CountryName> = new Set([
  "USA",
  "Canada",
  "UK",
]);

const COUNTRY_CODES = new Set(["US", "CA", "GB"] as const);
type CountryCode = "US" | "CA" | "GB";

const VOLUME_LITERALS = new Set(["none", "100", "500", "1000"] as const);
type VolumeLiteral = "none" | "100" | "500" | "1000";

function asCoverGradient(value: string | null): CoverGradient {
  return value && COVER_GRADIENTS.has(value as CoverGradient)
    ? (value as CoverGradient)
    : "blue-indigo";
}

function asCountryName(value: string | null): CountryName {
  return value && COUNTRY_NAMES.has(value as CountryName)
    ? (value as CountryName)
    : "USA";
}

function asCountryCode(value: string | null): CountryCode {
  return value && COUNTRY_CODES.has(value as CountryCode)
    ? (value as CountryCode)
    : "US";
}

function asVolume(value: string | null): VolumeLiteral {
  return value && VOLUME_LITERALS.has(value as VolumeLiteral)
    ? (value as VolumeLiteral)
    : "none";
}

function asAboutTuple(value: string[] | null): [string, string, string] {
  const [a = "", b = "", c = ""] = value ?? [];
  return [a, b, c];
}

export function mapReviewRow(row: ReviewRow): Review {
  return {
    reviewerName: row.reviewer_name,
    reviewerCompany: row.reviewer_company ?? "",
    date: row.reviewed_at,
    rating: row.rating as Review["rating"],
    text: row.text,
    verified: row.verified ?? false,
    helpful: row.helpful_count ?? 0,
  };
}

export function mapWarehouseRow(row: WarehouseRow): WarehouseLocation {
  return {
    city: row.city,
    address: row.address ?? "",
    sqft: row.sqft ?? 0,
    hours: row.hours ?? "",
    services: row.services ?? [],
  };
}

export function mapPartnerRow(
  row: PartnerRow,
  reviews: ReviewRow[],
  warehouses: WarehouseRow[]
): Partner {
  return {
    name: row.name,
    slug: row.slug,
    location: row.location ?? "",
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    services: row.services ?? [],
    verified: row.verified ?? false,
    description: row.description ?? "",
    logoPlaceholder: row.logo_placeholder ?? "",

    tagline: row.tagline ?? "",
    yearFounded: row.year_founded ?? 0,
    employeeCount: row.employee_count ?? "",
    coverGradient: asCoverGradient(row.cover_gradient),
    countryCode: asCountryCode(row.country_code),
    region: row.region ?? "",
    specialties: row.specialties ?? [],
    integrations: row.integrations ?? [],
    certifications: row.certifications ?? [],
    minimumOrderVolume: asVolume(row.minimum_order_volume),
    pricingModel: row.pricing_model ?? "",
    responseTime: row.response_time ?? "",
    fulfillmentSpeed: row.fulfillment_speed ?? "",
    orderAccuracy: row.order_accuracy ?? 0,
    yearsInBusiness: row.years_in_business ?? 0,
    activeBrandsServed: row.active_brands_served ?? 0,
    contact: (row.contact as Partner["contact"]) ?? {
      phone: "",
      email: "",
      website: "",
    },
    about: asAboutTuple(row.about),
    detailedServices:
      (row.detailed_services as Partner["detailedServices"]) ?? [],
    warehouses: warehouses.map(mapWarehouseRow),
    reviews: reviews.map(mapReviewRow),
    ratingBreakdown:
      (row.rating_breakdown as Partner["ratingBreakdown"]) ?? {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },

    country: asCountryName(row.country),
    state: row.state ?? "",
    stateFullName: row.state_full_name ?? "",
    city: row.city,
    cityFullName: row.city_full_name,
    servedStates: row.served_states ?? [],
    serviceCategories: row.service_categories ?? [],
  };
}
