/**
 * Phase 1D-1 utility: wipe all rows from warehouses, reviews, partners.
 *
 * FK order matters: warehouses → reviews → partners. Children before parents.
 *
 * Usage:  npm run db:reset
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createSupabaseAdminClient } from "../src/lib/supabase/admin";

const NIL_UUID = "00000000-0000-0000-0000-000000000000";

async function reset() {
  const admin = createSupabaseAdminClient();

  for (const table of ["warehouses", "reviews", "partners"] as const) {
    const { count: before } = await admin
      .from(table)
      .select("*", { count: "exact", head: true });

    const { error } = await admin.from(table).delete().neq("id", NIL_UUID);
    if (error) {
      throw new Error(`Failed to clear ${table}: ${error.message}`);
    }

    console.log(`Cleared ${before ?? 0} rows from ${table}`);
  }

  console.log("\n✓ Reset complete.");
}

reset().catch((err) => {
  console.error("\n✗ Reset failed:", err.message ?? err);
  process.exit(1);
});
