import Link from "next/link";
import {
  Building2,
  MessageSquareText,
  Users,
  ListTodo,
  Activity,
  Plus,
} from "lucide-react";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import {
  AdminActivityItem,
  type ActivityEntry,
} from "@/components/admin/admin-activity-item";
import type { AdminActionType } from "@/lib/actions/admin/_audit";

export const metadata = { title: "Overview" };

interface PartnerStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  featured: number;
}

interface UserStats {
  total: number;
  admins: number;
  users: number;
}

interface ReviewStats {
  total: number;
  avgRating: number;
}

async function loadPartnerStats(): Promise<PartnerStats> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("partners")
    .select("verified, is_featured, is_active");
  const rows = data ?? [];
  const stats: PartnerStats = {
    total: rows.length,
    active: 0,
    inactive: 0,
    verified: 0,
    featured: 0,
  };
  for (const r of rows as { verified: boolean | null; is_featured: boolean | null; is_active: boolean | null }[]) {
    if (r.is_active) stats.active += 1;
    else stats.inactive += 1;
    if (r.verified) stats.verified += 1;
    if (r.is_featured) stats.featured += 1;
  }
  return stats;
}

async function loadUserStats(): Promise<UserStats> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profiles").select("role");
  const rows = (data as { role: "user" | "admin" }[] | null) ?? [];
  let admins = 0;
  for (const r of rows) if (r.role === "admin") admins += 1;
  return { total: rows.length, admins, users: rows.length - admins };
}

async function loadReviewStats(): Promise<ReviewStats> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("reviews").select("rating");
  const rows = (data as { rating: number | null }[] | null) ?? [];
  if (rows.length === 0) return { total: 0, avgRating: 0 };
  const sum = rows.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  return { total: rows.length, avgRating: sum / rows.length };
}

interface AdminActionRow {
  id: string;
  action_type: AdminActionType;
  metadata: Record<string, unknown> | null;
  created_at: string;
  admin_id: string;
}

async function loadRecentActivity(): Promise<ActivityEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("admin_actions")
    .select("id, action_type, metadata, created_at, admin_id")
    .order("created_at", { ascending: false })
    .limit(15);
  const rows = (data as AdminActionRow[] | null) ?? [];
  if (rows.length === 0) return [];

  const adminIds = Array.from(new Set(rows.map((r) => r.admin_id)));
  const { data: admins } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", adminIds);
  const adminMap = new Map(
    ((admins as { id: string; full_name: string | null; email: string }[]) ?? []).map(
      (a) => [a.id, a]
    )
  );

  return rows.map((r) => {
    const admin = adminMap.get(r.admin_id);
    return {
      id: r.id,
      action_type: r.action_type,
      admin_name: admin?.full_name ?? null,
      admin_email: admin?.email ?? "Unknown",
      created_at: r.created_at,
      metadata: r.metadata,
    };
  });
}

function firstName(profile: { full_name: string | null; email: string }): string {
  const source = profile.full_name?.trim() || profile.email;
  return source.split(/[\s@.]+/)[0] ?? "there";
}

export default async function AdminOverviewPage() {
  const profile = await getCurrentProfile();
  // Layout already redirects when this is null. Safe to assert.
  const greeting = firstName(profile!);

  const [partnerStats, userStats, reviewStats, activity] = await Promise.all([
    loadPartnerStats(),
    loadUserStats(),
    loadReviewStats(),
    loadRecentActivity(),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/admin/partners/new"
          className="inline-flex h-11 w-[180px] items-center justify-center gap-1.5 rounded-lg bg-blue px-4 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Add new partner
        </Link>
        <Link
          href="/admin/partners"
          className="inline-flex h-11 w-[180px] items-center justify-center rounded-lg border border-border bg-surface px-4 text-[14px] font-medium text-text transition-colors hover:bg-background"
        >
          View all partners
        </Link>
        <Link
          href="/admin/users"
          className="inline-flex h-11 w-[180px] items-center justify-center rounded-lg border border-border bg-surface px-4 text-[14px] font-medium text-text transition-colors hover:bg-background"
        >
          Manage users
        </Link>
      </div>

      <AdminPageHeader
        title="Overview"
        description={`Welcome back, ${greeting}. Here's what's happening on Prep Parcel.`}
      />

      {/* Stats grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total partners"
          value={partnerStats.active}
          detail={`${partnerStats.verified} verified · ${partnerStats.featured} featured · ${partnerStats.inactive} inactive`}
          icon={<Building2 className="h-4 w-4" strokeWidth={2} />}
        />
        <AdminStatCard
          label="Total reviews"
          value={reviewStats.total}
          detail={
            reviewStats.total > 0
              ? `${reviewStats.avgRating.toFixed(2)} avg rating`
              : "No reviews yet"
          }
          icon={<MessageSquareText className="h-4 w-4" strokeWidth={2} />}
        />
        <AdminStatCard
          label="Total users"
          value={userStats.total}
          detail={`${userStats.admins} admin · ${userStats.users} user`}
          icon={<Users className="h-4 w-4" strokeWidth={2} />}
        />
        <AdminStatCard
          label="Pending tasks"
          value={0}
          detail="0 reviews to moderate · 0 claims to verify"
          icon={<ListTodo className="h-4 w-4" strokeWidth={2} />}
        />
      </div>

      {/* Recent activity */}
      <section className="mt-10">
        <h2 className="text-[18px] font-semibold text-text">
          Recent admin activity
        </h2>
        {activity.length === 0 ? (
          <AdminEmptyState
            className="mt-4"
            icon={<Activity className="h-4 w-4" strokeWidth={2} />}
            title="No recent activity"
            description="Admin actions will appear here as you and your team manage partners and users."
          />
        ) : (
          <ul className="mt-4 rounded-xl border border-border bg-surface px-4 py-2">
            {activity.map((entry) => (
              <AdminActivityItem key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
