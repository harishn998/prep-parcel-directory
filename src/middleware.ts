import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { isSiteNoindex } from "@/lib/seo/noindex";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Calling getUser() validates the JWT against Supabase's auth server and
  // triggers session-cookie refresh as a side effect.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Partner dashboard: gate at the edge by role (mirrors /admin above and the
  // /list-your-3pl fix). Doing it here means a signed-out or wrong-role
  // client-side navigation is redirected before /partner renders, so the shared
  // route-transition wrapper never mounts a redirecting route.
  if (pathname === "/partner") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (profile?.role !== "partner") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Auth gate at the edge (mirrors /admin above). The page's server component
  // also calls redirect() as a backstop — but doing it here means a signed-out
  // *client-side* navigation is redirected before any route renders, so the
  // shared route-transition wrapper never mounts a redirecting route mid-
  // transition (which crashed with a React hook-count mismatch and a blank
  // page on the first click; a hard refresh worked because it had no client
  // transition).
  if (pathname === "/list-your-3pl" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isSiteNoindex()) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *   _next/static, _next/image, favicon.ico, common static asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
