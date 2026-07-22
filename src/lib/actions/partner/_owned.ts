import "server-only";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Resolve the partner listing owned by the current session user, from the
 * session — NEVER from a client-passed id. Returns null unless the caller is a
 * `partner` who owns a row. Every partner media/warehouse write funnels through
 * this so a forged partner id can't redirect a write to someone else's listing.
 *
 * Runs on the cookie-session (RLS) client. Reads via the owner-SELECT policy
 * (0012), so a still-hidden listing resolves too.
 */
export async function resolveOwnedPartner(): Promise<
  { id: string; slug: string } | null
> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "partner") return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("partners")
    .select("id, slug")
    .eq("owner_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return { id: data.id as string, slug: data.slug as string };
}
