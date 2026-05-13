import Link from "next/link";
import { Plus, Search, Building2 } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { relativeTime } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PartnerRowActions } from "@/components/admin/partner-row-actions";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export const metadata = { title: "Partners" };

const PAGE_SIZE = 25;

type StatusFilter = "all" | "active" | "inactive";
type VerifiedFilter = "all" | "verified" | "unverified";
type CountryFilter = "all" | "USA" | "Canada" | "UK";
type SortKey = "name" | "updated" | "reviews";
type SortDir = "asc" | "desc";

function parseStatus(v: string | undefined): StatusFilter {
  return v === "active" || v === "inactive" ? v : "all";
}
function parseVerified(v: string | undefined): VerifiedFilter {
  return v === "verified" || v === "unverified" ? v : "all";
}
function parseCountry(v: string | undefined): CountryFilter {
  return v === "USA" || v === "Canada" || v === "UK" ? v : "all";
}
function parseSort(v: string | undefined): SortKey {
  return v === "name" || v === "reviews" ? v : "updated";
}
function parseDir(v: string | undefined): SortDir {
  return v === "asc" ? "asc" : "desc";
}
function parsePage(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

interface PartnersListRow {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  country_code: string | null;
  rating: number | null;
  review_count: number | null;
  verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  updated_at: string;
}

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const status = parseStatus(sp.status as string | undefined);
  const verified = parseVerified(sp.verified as string | undefined);
  const country = parseCountry(sp.country as string | undefined);
  const sort = parseSort(sp.sort as string | undefined);
  const dir = parseDir(sp.dir as string | undefined);
  const page = parsePage(sp.page as string | undefined);

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("partners")
    .select(
      "id, slug, name, city, state, country, country_code, rating, review_count, verified, is_featured, is_active, updated_at",
      { count: "exact" }
    );

  if (q) {
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,city.ilike.%${q}%`);
  }
  if (status === "active") query = query.eq("is_active", true);
  if (status === "inactive") query = query.eq("is_active", false);
  if (verified === "verified") query = query.eq("verified", true);
  if (verified === "unverified") query = query.eq("verified", false);
  if (country !== "all") query = query.eq("country", country);

  const sortColumn =
    sort === "name" ? "name" : sort === "reviews" ? "review_count" : "updated_at";
  query = query.order(sortColumn, { ascending: dir === "asc" });

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, count } = await query;
  const rows = (data as PartnersListRow[] | null) ?? [];
  const total = count ?? 0;
  const pageStart = total === 0 ? 0 : from + 1;
  const pageEnd = Math.min(to + 1, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hasFilters = q || status !== "all" || verified !== "all" || country !== "all";

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      <AdminPageHeader
        title="Partners"
        description="Manage 3PL partner listings, profiles, and verification status."
        actions={
          <Link
            href="/admin/partners/new"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-blue px-4 text-[14px] font-medium text-white transition-colors hover:bg-blue-hover"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Add new partner
          </Link>
        }
      />

      {/* Toolbar */}
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
            placeholder="Search by name, slug, or city…"
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-[14px] outline-none transition-colors focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15"
          />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-[14px] text-text"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          name="verified"
          defaultValue={verified}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-[14px] text-text"
        >
          <option value="all">All verification</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <select
          name="country"
          defaultValue={country}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-[14px] text-text"
        >
          <option value="all">All countries</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
        </select>
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir} />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-navy px-4 text-[14px] font-medium text-white transition-colors hover:bg-blue"
        >
          Apply
        </button>
        <div className="hidden whitespace-nowrap text-[12px] text-text-3 md:block">
          {total === 0 ? "0 partners" : `${pageStart}–${pageEnd} of ${total} partners`}
        </div>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        {rows.length === 0 ? (
          <AdminEmptyState
            className="border-0 bg-transparent"
            icon={<Building2 className="h-4 w-4" />}
            title={hasFilters ? "No partners match your filters" : "No partners yet"}
            description={
              hasFilters
                ? "Try clearing one or more filters to see more results."
                : "Add your first partner to start managing the directory."
            }
            action={
              hasFilters ? (
                <Link
                  href="/admin/partners"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-4 text-[13px] font-medium text-text transition-colors hover:bg-background"
                >
                  Clear filters
                </Link>
              ) : (
                <Link
                  href="/admin/partners/new"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-blue px-4 text-[13px] font-medium text-white transition-colors hover:bg-blue-hover"
                >
                  Add new partner
                </Link>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10" />
                <TableHead>
                  <SortHeader
                    label="Partner"
                    sortKey="name"
                    current={sort}
                    dir={dir}
                    sp={sp}
                    page={page}
                  />
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <SortHeader
                    label="Reviews"
                    sortKey="reviews"
                    current={sort}
                    dir={dir}
                    sp={sp}
                    page={page}
                  />
                </TableHead>
                <TableHead>
                  <SortHeader
                    label="Updated"
                    sortKey="updated"
                    current={sort}
                    dir={dir}
                    sp={sp}
                    page={page}
                  />
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.is_active ? undefined : "opacity-60"}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.name}`}
                      className="h-4 w-4 cursor-default rounded border-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/partners/${row.id}`}
                      className="block min-w-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background font-mono text-[11px] font-semibold text-text-2">
                          {row.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-medium text-text hover:text-blue">
                            {row.name}
                          </div>
                          <div className="truncate font-mono text-[11px] text-text-3">
                            {row.slug}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[13px]">
                      {row.country_code ? (
                        <span className="inline-flex h-5 items-center rounded-sm border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-text-2">
                          {row.country_code}
                        </span>
                      ) : null}
                      <span className="text-text-2">
                        {row.city ?? row.state ?? "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {row.is_active ? (
                        <Badge tone="success">Active</Badge>
                      ) : (
                        <Badge tone="danger">Inactive</Badge>
                      )}
                      {row.verified ? <Badge tone="info">Verified</Badge> : null}
                      {row.is_featured ? (
                        <Badge tone="amber">Featured</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[13px] text-text-2">
                      {(row.rating ?? 0).toFixed(1)}{" "}
                      <span className="text-text-3">
                        ({row.review_count ?? 0})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-text-2">
                    {relativeTime(row.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <PartnerRowActions partner={row} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-[12px] text-text-3">
            {pageStart}–{pageEnd} of {total}
          </div>
          <div className="flex items-center gap-2">
            <PageLink
              page={page - 1}
              disabled={page <= 1}
              sp={sp}
              label="Previous"
            />
            <PageLink
              page={page + 1}
              disabled={page >= totalPages}
              sp={sp}
              label="Next"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "success" | "danger" | "info" | "amber";
  children: React.ReactNode;
}) {
  const toneClass: Record<typeof tone, string> = {
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  sp,
  page,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  sp: Record<string, string | string[] | undefined>;
  page: number;
}) {
  const isActive = current === sortKey;
  const nextDir: SortDir = isActive && dir === "asc" ? "desc" : "asc";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
  }
  params.set("sort", sortKey);
  params.set("dir", nextDir);
  params.set("page", String(page));
  return (
    <Link
      href={`/admin/partners?${params.toString()}`}
      className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-text-3 transition-colors hover:text-text"
    >
      {label}
      {isActive ? <span aria-hidden>{dir === "asc" ? "↑" : "↓"}</span> : null}
    </Link>
  );
}

function PageLink({
  page,
  disabled,
  sp,
  label,
}: {
  page: number;
  disabled: boolean;
  sp: Record<string, string | string[] | undefined>;
  label: string;
}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params.set(k, v);
  }
  params.set("page", String(page));
  if (disabled) {
    return (
      <span className="inline-flex h-9 items-center rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-text-3 opacity-50">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/admin/partners?${params.toString()}`}
      className="inline-flex h-9 items-center rounded-lg border border-border bg-surface px-3 text-[13px] font-medium text-text transition-colors hover:bg-background"
    >
      {label}
    </Link>
  );
}
