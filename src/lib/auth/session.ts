import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/data/db-types";

/**
 * Returns the current authenticated user, validated against Supabase's auth
 * server. Use this — NOT supabase.auth.getSession() — because getSession()
 * just reads the cookie, which is forgeable.
 */
export const getSession = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(
  async (): Promise<ProfileRow | null> => {
    const user = await getSession();
    if (!user) return null;

    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) return data as ProfileRow;

    // Self-heal: trigger may have failed during signup. Materialize the row
    // via the security-definer ensure_profile() RPC, then re-read.
    await supabase.rpc("ensure_profile");
    const { data: healed } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return (healed as ProfileRow | null) ?? null;
  }
);

export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
});

export async function requireAdmin(): Promise<void> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorized: admin role required");
  }
}
