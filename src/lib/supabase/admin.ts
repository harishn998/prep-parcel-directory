/**
 * !!! ADMIN CLIENT — BYPASSES ROW LEVEL SECURITY !!!
 *
 * This client uses the Supabase service role key. It can read and write
 * ANY row in the database, ignoring all RLS policies.
 *
 * RULES:
 *   - NEVER import this from a client component, browser-shipped code,
 *     or any module that could end up in a bundle sent to the user.
 *   - ONLY use from server-side scripts (`scripts/*.ts`), Route Handlers,
 *     Server Actions, or Server Components that need elevated access.
 *   - The service role key MUST stay in server-only env (.env.local,
 *     deployment env vars). Never prefix with NEXT_PUBLIC_.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdmin: SupabaseClient | null = null;

export function createSupabaseAdminClient(): SupabaseClient {
  if (cachedAdmin) return cachedAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Check your .env.local."
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. The admin client refuses to run without it. Check your .env.local."
    );
  }

  cachedAdmin = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdmin;
}
