/**
 * Hand-written Supabase row types matching supabase/migrations/0001_init.sql.
 *
 * These cover the columns we read in 1D-2. Insert/Update placeholders are
 * loose (Partial<Row>) for now; Phase 1E (writes) will tighten them.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface PartnerRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  about: string[] | null;
  logo_placeholder: string | null;
  logo_url: string | null;
  cover_gradient: string | null;
  cover_image_url: string | null;

  location: string | null;
  country: string | null;
  country_code: string | null;
  state: string | null;
  state_full_name: string | null;
  city: string | null;
  city_full_name: string | null;
  region: string | null;
  served_states: string[] | null;

  year_founded: number | null;
  years_in_business: number | null;
  employee_count: string | null;
  active_brands_served: number | null;
  minimum_order_volume: string | null;
  pricing_model: string | null;
  response_time: string | null;
  fulfillment_speed: string | null;
  order_accuracy: number | null;

  services: string[] | null;
  service_categories: string[] | null;
  integrations: string[] | null;
  certifications: string[] | null;
  specialties: string[] | null;

  rating: number | null;
  review_count: number | null;
  rating_breakdown: Json | null;

  detailed_services: Json | null;
  contact: Json | null;

  verified: boolean | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  is_claimed: boolean | null;
  profile_score: number | null;
  plan: string | null;

  meta_title: string | null;
  meta_description: string | null;

  created_at: string;
  updated_at: string;
}

export interface ReviewRow {
  id: string;
  partner_id: string;
  reviewer_name: string;
  reviewer_company: string | null;
  reviewer_avatar_url: string | null;
  rating: number; // CHECK rating between 1 and 5 — narrowed in mapper.
  text: string;
  verified: boolean | null;
  helpful_count: number | null;
  reviewed_at: string; // YYYY-MM-DD
  created_at: string;
}

export interface WarehouseRow {
  id: string;
  partner_id: string;
  city: string;
  address: string | null;
  sqft: number | null;
  hours: string | null;
  services: string[] | null;
  lat: number | null;
  lng: number | null;
  is_primary: boolean | null;
  created_at: string;
}

export type UserRole = "user" | "admin";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      partners: {
        Row: PartnerRow;
        Insert: Partial<PartnerRow>;
        Update: Partial<PartnerRow>;
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow>;
        Update: Partial<ReviewRow>;
      };
      warehouses: {
        Row: WarehouseRow;
        Insert: Partial<WarehouseRow>;
        Update: Partial<WarehouseRow>;
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow>;
        Update: Partial<ProfileRow>;
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
