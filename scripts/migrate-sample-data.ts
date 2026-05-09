/**
 * Phase 1D-1 migration: load sample-data.ts into Supabase.
 *
 * Idempotent: at the start, wipes warehouses → reviews → partners (FK order).
 * Re-running this script reseeds from scratch without duplicates.
 *
 * Usage:  npm run db:migrate
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createSupabaseAdminClient } from "../src/lib/supabase/admin";
import { partners as sampleData } from "../src/lib/sample-data";

const NIL_UUID = "00000000-0000-0000-0000-000000000000";

async function reset(admin: ReturnType<typeof createSupabaseAdminClient>) {
  console.log("Resetting tables (warehouses → reviews → partners)...");
  for (const table of ["warehouses", "reviews", "partners"] as const) {
    const { error } = await admin.from(table).delete().neq("id", NIL_UUID);
    if (error) {
      throw new Error(`Failed to clear ${table}: ${error.message}`);
    }
  }
  console.log("  Reset complete.\n");
}

function toDateString(iso: string): string {
  // Sample data dates are already YYYY-MM-DD strings; normalize via Date to be safe.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid review date: ${iso}`);
  }
  return d.toISOString().slice(0, 10);
}

async function migrate() {
  const admin = createSupabaseAdminClient();
  await reset(admin);

  let totalReviews = 0;
  let totalWarehouses = 0;

  for (let i = 0; i < sampleData.length; i++) {
    const p = sampleData[i];
    const partnerRow = {
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      about: p.about,
      logo_placeholder: p.logoPlaceholder,
      cover_gradient: p.coverGradient,
      location: p.location,
      country: p.country,
      country_code: p.countryCode,
      state: p.state,
      state_full_name: p.stateFullName,
      city: p.city,
      city_full_name: p.cityFullName,
      region: p.region,
      served_states: p.servedStates,
      year_founded: p.yearFounded,
      years_in_business: p.yearsInBusiness,
      employee_count: p.employeeCount,
      active_brands_served: p.activeBrandsServed,
      minimum_order_volume: p.minimumOrderVolume,
      pricing_model: p.pricingModel,
      response_time: p.responseTime,
      fulfillment_speed: p.fulfillmentSpeed,
      order_accuracy: p.orderAccuracy,
      services: p.services,
      service_categories: p.serviceCategories,
      integrations: p.integrations,
      certifications: p.certifications,
      specialties: p.specialties,
      rating: p.rating,
      review_count: p.reviewCount,
      rating_breakdown: p.ratingBreakdown,
      detailed_services: p.detailedServices,
      contact: p.contact,
      verified: p.verified,
    };

    const { data: insertedPartner, error: partnerErr } = await admin
      .from("partners")
      .insert(partnerRow)
      .select("id")
      .single();

    if (partnerErr || !insertedPartner) {
      throw new Error(
        `Partner insert failed for ${p.slug}: ${partnerErr?.message ?? "no row returned"}`
      );
    }

    const partnerId = insertedPartner.id as string;

    const reviewRows = p.reviews.map((r) => ({
      partner_id: partnerId,
      reviewer_name: r.reviewerName,
      reviewer_company: r.reviewerCompany,
      rating: r.rating,
      text: r.text,
      verified: r.verified,
      helpful_count: r.helpful,
      reviewed_at: toDateString(r.date),
    }));

    if (reviewRows.length > 0) {
      const { error: reviewsErr } = await admin
        .from("reviews")
        .insert(reviewRows);
      if (reviewsErr) {
        throw new Error(
          `Reviews insert failed for ${p.slug}: ${reviewsErr.message}`
        );
      }
    }

    const warehouseRows = p.warehouses.map((w, wi) => ({
      partner_id: partnerId,
      city: w.city,
      address: w.address,
      sqft: w.sqft,
      hours: w.hours,
      services: w.services,
      is_primary: wi === 0,
    }));

    if (warehouseRows.length > 0) {
      const { error: whErr } = await admin
        .from("warehouses")
        .insert(warehouseRows);
      if (whErr) {
        throw new Error(
          `Warehouses insert failed for ${p.slug}: ${whErr.message}`
        );
      }
    }

    totalReviews += reviewRows.length;
    totalWarehouses += warehouseRows.length;

    console.log(
      `[${i + 1}/${sampleData.length}] Inserted ${p.name} with ${reviewRows.length} reviews and ${warehouseRows.length} warehouse${warehouseRows.length === 1 ? "" : "s"}`
    );
  }

  console.log("\nVerifying counts...");
  const counts: Record<string, number | null> = {};
  for (const table of ["partners", "reviews", "warehouses"] as const) {
    const { count, error } = await admin
      .from(table)
      .select("*", { count: "exact", head: true });
    if (error) {
      throw new Error(`Count query failed for ${table}: ${error.message}`);
    }
    counts[table] = count;
  }

  console.log(`  partners:   ${counts.partners}`);
  console.log(`  reviews:    ${counts.reviews}`);
  console.log(`  warehouses: ${counts.warehouses}`);

  if (counts.partners !== sampleData.length) {
    throw new Error(
      `Partner count mismatch: expected ${sampleData.length}, got ${counts.partners}`
    );
  }
  if (counts.reviews !== totalReviews) {
    throw new Error(
      `Review count mismatch: expected ${totalReviews}, got ${counts.reviews}`
    );
  }
  if (counts.warehouses !== totalWarehouses) {
    throw new Error(
      `Warehouse count mismatch: expected ${totalWarehouses}, got ${counts.warehouses}`
    );
  }

  console.log("\n✓ Migration complete.");
}

migrate().catch((err) => {
  console.error("\n✗ Migration failed:", err.message ?? err);
  process.exit(1);
});
