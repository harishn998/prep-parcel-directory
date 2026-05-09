export type CoverGradient = "navy-blue" | "navy-amber" | "blue-indigo";

export type CountryName = "USA" | "Canada" | "UK";

export type Review = {
  reviewerName: string;
  reviewerCompany: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  verified: boolean;
  helpful: number;
};

export type WarehouseLocation = {
  city: string;
  address: string;
  sqft: number;
  hours: string;
  services: string[];
};

export type DetailedService = {
  name: string;
  description: string;
  included: boolean;
};

export type Partner = {
  // Phase 1A core
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: string[];
  verified: boolean;
  description: string;
  logoPlaceholder: string;

  // Phase 1B profile fields
  tagline: string;
  yearFounded: number;
  employeeCount: string;
  coverGradient: CoverGradient;
  countryCode: "US" | "CA" | "GB";
  region: string; // e.g. state or province for filtering
  specialties: string[];
  integrations: string[];
  certifications: string[];
  minimumOrderVolume: "none" | "100" | "500" | "1000";
  pricingModel: string;
  responseTime: string;
  fulfillmentSpeed: string;
  orderAccuracy: number; // percentage, e.g. 99.7
  yearsInBusiness: number;
  activeBrandsServed: number;
  contact: { phone: string; email: string; website: string };
  about: [string, string, string];
  detailedServices: DetailedService[];
  warehouses: WarehouseLocation[];
  reviews: Review[];
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };

  // Phase 1C SEO architecture fields
  country: CountryName;
  state: string; // taxonomy state slug e.g. 'california'
  stateFullName: string; // 'California'
  city: string | null; // taxonomy city slug, or null when primary city is off-taxonomy
  cityFullName: string | null;
  servedStates: string[]; // includes primary state; states this partner can serve
  serviceCategories: string[]; // taxonomy category slugs the partner offers
};
