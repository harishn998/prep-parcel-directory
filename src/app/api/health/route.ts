import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("partners")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          responseTimeMs: Date.now() - startTime,
          checks: {
            supabase: "failed",
            error: error.message,
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
      environment: process.env.NODE_ENV,
      checks: {
        supabase: "ok",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
        checks: {
          runtime: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        },
      },
      { status: 503 }
    );
  }
}
