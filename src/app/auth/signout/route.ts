import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// POST-only by design — GET signout would let `<img src="/auth/signout">`
// or any other GET emit a CSRF-style logout.
export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "/";
  return NextResponse.redirect(base.endsWith("/") ? base : `${base}/`, {
    status: 303, // see-other — switches POST→GET on the redirect
  });
}
