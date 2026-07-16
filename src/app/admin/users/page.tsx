import { Search, Users } from "lucide-react";

import { getCurrentProfile } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { relativeTime } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { UserRowActions } from "@/components/admin/user-row-actions";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { ProfileRow, UserRole } from "@/lib/data/db-types";

export const metadata = { title: "Users" };

type RoleFilter = "all" | "user" | "admin";

function parseRole(v: string | undefined): RoleFilter {
  return v === "user" || v === "admin" ? v : "all";
}

function initialsFor(profile: { full_name: string | null; email: string }): string {
  const source = profile.full_name?.trim() || profile.email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const role = parseRole(sp.role as string | undefined);

  const self = await getCurrentProfile();
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (role !== "all") {
    query = query.eq("role", role);
  }
  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  const { data } = await query;
  const profiles = (data as ProfileRow[] | null) ?? [];

  // Fetch last_sign_in_at via admin client (auth.users isn't exposed via RLS).
  let lastSignInMap = new Map<string, string | null>();
  try {
    const admin = createSupabaseAdminClient();
    const { data: authData } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authData?.users) {
      lastSignInMap = new Map(
        authData.users.map((u) => [u.id, u.last_sign_in_at ?? null])
      );
    }
  } catch {
    // If admin client is misconfigured (e.g., missing service role in dev),
    // gracefully degrade — last-sign-in column will show "—".
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <AdminPageHeader
        title="Users"
        description="Manage user accounts and role assignments."
      />

      <form
        method="get"
        className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 md:flex-row md:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by email or name…"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-[14px] outline-none transition-colors focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15"
          />
        </div>
        <select
          name="role"
          defaultValue={role}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-[14px] text-text"
        >
          <option value="all">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-navy px-4 text-[14px] font-medium text-white transition-colors hover:bg-blue"
        >
          Apply
        </button>
        <div className="hidden whitespace-nowrap text-[12px] text-text-3 md:block">
          {profiles.length} {profiles.length === 1 ? "user" : "users"}
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {profiles.length === 0 ? (
          <AdminEmptyState
            className="border-0 bg-transparent"
            icon={<Users className="h-4 w-4" />}
            title="No users match your filters"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((u) => {
                const lastSignIn = lastSignInMap.get(u.id);
                const initials = initialsFor(u);
                const displayName = u.full_name?.trim() || u.email;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar_url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">
                            {initials}
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-medium text-text">
                            {displayName}
                          </div>
                          <div className="truncate text-[12px] text-text-3">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell className="text-[13px] text-text-2">
                      {relativeTime(u.created_at)}
                    </TableCell>
                    <TableCell className="text-[13px] text-text-2">
                      {lastSignIn ? relativeTime(lastSignIn) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserRowActions
                        user={u}
                        selfId={self?.id ?? ""}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "admin") {
    return (
      <span className="inline-flex h-5 items-center rounded-full bg-navy px-2 text-[11px] font-medium uppercase tracking-wide text-white">
        Admin
      </span>
    );
  }
  if (role === "partner") {
    return (
      <span className="inline-flex h-5 items-center rounded-full bg-blue/10 px-2 text-[11px] font-medium uppercase tracking-wide text-blue ring-1 ring-blue/20">
        Partner
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 items-center rounded-full bg-background px-2 text-[11px] font-medium text-text-2 ring-1 ring-border">
      User
    </span>
  );
}
