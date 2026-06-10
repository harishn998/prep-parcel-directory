import type {
  Partner,
  Review,
  WarehouseLocation,
  CoverGradient,
  CountryName,
} from "./types";
import type { PartnerRow, ReviewRow, WarehouseRow } from "./db-types";
import type { PartnerFormData, PartnerUpdateData } from "@/lib/validation/partner";
import type { WarehouseFormData, WarehouseUpdateData } from "@/lib/validation/warehouse";

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
    featured: row.is_featured ?? false,
    description: row.description ?? "",
    logoPlaceholder: row.logo_placeholder ?? "",
    logoUrl: row.logo_url ?? null,
    coverImageUrl: row.cover_image_url ?? null,

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

// ─────────────────────────────────────
// Write-side mappers: form (camelCase) → DB row (snake_case)
// Used by admin server actions to insert/update partners + warehouses.
// ─────────────────────────────────────

type PartnerWriteRow = Partial<
  Omit<PartnerRow, "id" | "created_at" | "updated_at">
>;

export function partnerFormToInsertRow(form: PartnerFormData): PartnerWriteRow {
  return {
    slug: form.slug,
    name: form.name,
    tagline: form.tagline ?? null,
    description: form.description ?? null,

    location: form.location,
    country: form.country,
    country_code: form.countryCode,
    state: form.state,
    state_full_name: form.stateFullName,
    city: form.city ?? null,
    city_full_name: form.cityFullName ?? null,
    served_states: form.servedStates,

    year_founded: form.yearFounded ?? null,
    employee_count: form.employeeCount ?? null,
    minimum_order_volume: form.minimumOrderVolume ?? null,
    pricing_model: form.pricingModel ?? null,
    response_time: form.responseTime ?? null,
    fulfillment_speed: form.fulfillmentSpeed ?? null,
    order_accuracy: form.orderAccuracy ?? null,
    active_brands_served: form.activeBrandsServed ?? null,

    services: form.services,
    service_categories: form.serviceCategories,
    integrations: form.integrations,
    certifications: form.certifications,
    specialties: form.specialties,

    contact: form.contact ?? null,

    verified: form.verified,
    is_featured: form.isFeatured,
    is_active: form.isActive,

    meta_title: form.metaTitle ?? null,
    meta_description: form.metaDescription ?? null,
  };
}

export function partnerUpdateToRow(form: PartnerUpdateData): PartnerWriteRow {
  const out: PartnerWriteRow = {};
  if (form.slug !== undefined) out.slug = form.slug;
  if (form.name !== undefined) out.name = form.name;
  if (form.tagline !== undefined) out.tagline = form.tagline;
  if (form.description !== undefined) out.description = form.description;

  if (form.location !== undefined) out.location = form.location;
  if (form.country !== undefined) out.country = form.country;
  if (form.countryCode !== undefined) out.country_code = form.countryCode;
  if (form.state !== undefined) out.state = form.state;
  if (form.stateFullName !== undefined) out.state_full_name = form.stateFullName;
  if (form.city !== undefined) out.city = form.city;
  if (form.cityFullName !== undefined) out.city_full_name = form.cityFullName;
  if (form.servedStates !== undefined) out.served_states = form.servedStates;

  if (form.yearFounded !== undefined) out.year_founded = form.yearFounded;
  if (form.employeeCount !== undefined) out.employee_count = form.employeeCount;
  if (form.minimumOrderVolume !== undefined)
    out.minimum_order_volume = form.minimumOrderVolume;
  if (form.pricingModel !== undefined) out.pricing_model = form.pricingModel;
  if (form.responseTime !== undefined) out.response_time = form.responseTime;
  if (form.fulfillmentSpeed !== undefined)
    out.fulfillment_speed = form.fulfillmentSpeed;
  if (form.orderAccuracy !== undefined) out.order_accuracy = form.orderAccuracy;
  if (form.activeBrandsServed !== undefined)
    out.active_brands_served = form.activeBrandsServed;

  if (form.services !== undefined) out.services = form.services;
  if (form.serviceCategories !== undefined)
    out.service_categories = form.serviceCategories;
  if (form.integrations !== undefined) out.integrations = form.integrations;
  if (form.certifications !== undefined)
    out.certifications = form.certifications;
  if (form.specialties !== undefined) out.specialties = form.specialties;

  if (form.contact !== undefined) out.contact = form.contact;

  if (form.verified !== undefined) out.verified = form.verified;
  if (form.isFeatured !== undefined) out.is_featured = form.isFeatured;
  if (form.isActive !== undefined) out.is_active = form.isActive;

  if (form.metaTitle !== undefined) out.meta_title = form.metaTitle;
  if (form.metaDescription !== undefined)
    out.meta_description = form.metaDescription;

  return out;
}

type WarehouseWriteRow = Partial<
  Omit<WarehouseRow, "id" | "created_at">
>;

export function warehouseFormToInsertRow(
  form: WarehouseFormData,
  partnerId: string
): WarehouseWriteRow {
  return {
    partner_id: partnerId,
    city: form.city,
    address: form.address ?? null,
    sqft: form.sqft ?? null,
    hours: form.hours ?? null,
    services: form.services,
    is_primary: form.isPrimary,
  };
}

export function warehouseUpdateToRow(
  form: WarehouseUpdateData
): WarehouseWriteRow {
  const out: WarehouseWriteRow = {};
  if (form.city !== undefined) out.city = form.city;
  if (form.address !== undefined) out.address = form.address;
  if (form.sqft !== undefined) out.sqft = form.sqft;
  if (form.hours !== undefined) out.hours = form.hours;
  if (form.services !== undefined) out.services = form.services;
  if (form.isPrimary !== undefined) out.is_primary = form.isPrimary;
  return out;
}
