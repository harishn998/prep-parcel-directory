import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerEditForm } from "@/components/admin/partner-edit-form";
import type { PartnerRow, WarehouseRow } from "@/lib/data/db-types";
import type { PartnerFormData } from "@/lib/validation/partner";

export const metadata = { title: "Edit partner" };

function rowToFormData(row: PartnerRow): PartnerFormData {
  const country = (row.country === "Canada" || row.country === "UK"
    ? row.country
    : "USA") as PartnerFormData["country"];
  const countryCode = (row.country_code === "CA" || row.country_code === "GB"
    ? row.country_code
    : "US") as PartnerFormData["countryCode"];
  const contactRaw = row.contact as
    | { phone?: string | null; email?: string | null; website?: string | null }
    | null;
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    location: row.location ?? "",
    country,
    countryCode,
    state: row.state ?? "",
    stateFullName: row.state_full_name ?? "",
    city: row.city,
    cityFullName: row.city_full_name,
    servedStates: row.served_states ?? [],
    yearFounded: row.year_founded,
    employeeCount: row.employee_count,
    minimumOrderVolume: row.minimum_order_volume,
    pricingModel: row.pricing_model,
    responseTime: row.response_time,
    fulfillmentSpeed: row.fulfillment_speed,
    orderAccuracy: row.order_accuracy,
    activeBrandsServed: row.active_brands_served,
    services: row.services ?? [],
    serviceCategories: row.service_categories ?? [],
    integrations: row.integrations ?? [],
    certifications: row.certifications ?? [],
    specialties: row.specialties ?? [],
    contact: contactRaw
      ? {
          phone: contactRaw.phone ?? "",
          email: contactRaw.email ?? "",
          website: contactRaw.website ?? "",
        }
      : null,
    verified: row.verified ?? false,
    isFeatured: row.is_featured ?? false,
    isActive: row.is_active ?? true,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

export default async function PartnerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // RLS client + requireAdmin() gate (admin layout). The "Admins can read all
  // partners" policy (0011) lets admins see hidden (is_active=false) partners,
  // e.g. a listing just created by approving a submission.
  const supabase = await createSupabaseServerClient();

  const [partnerRes, warehousesRes] = await Promise.all([
    supabase.from("partners").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("warehouses")
      .select("*")
      .eq("partner_id", id)
      .order("is_primary", { ascending: false })
      .order("city", { ascending: true }),
  ]);

  const partner = partnerRes.data as PartnerRow | null;
  if (!partner) {
    notFound();
  }

  const warehouseRows = (warehousesRes.data as WarehouseRow[] | null) ?? [];
  const warehouses = warehouseRows.map((w) => ({
    id: w.id,
    city: w.city,
    address: w.address,
    sqft: w.sqft,
    hours: w.hours,
    services: w.services ?? [],
    is_primary: w.is_primary ?? false,
  }));

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      <AdminPageHeader
        title={partner.name}
        description={`Edit profile, status, and warehouses for /directory/${partner.slug}`}
      />
      <div className="mt-6">
        <PartnerEditForm
          partnerId={partner.id}
          initial={rowToFormData(partner)}
          warehouses={warehouses}
          meta={{ createdAt: partner.created_at, updatedAt: partner.updated_at }}
          currentLogoUrl={partner.logo_url}
          currentCoverUrl={partner.cover_image_url}
        />
      </div>
    </div>
  );
}
