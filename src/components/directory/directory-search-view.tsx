"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useQueryState,
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";
import type { Partner, DirectoryFacets } from "@/lib/data/types";
import { categories, type SortValue } from "@/lib/static-data";
import {
  emptyFilters,
  applyClientOnlyFilters,
  hasAnyFilter,
  STATE_NAME_TO_SLUG,
  STATE_SLUG_TO_NAME,
  type Filters,
} from "@/lib/filter-logic";
import { useDebouncedLoading } from "@/hooks/use-debounced-loading";
import { DirectoryPageHeader } from "./page-header";
import { QuickFilterStrip } from "./quick-filter-strip";
import { ActiveFilterChips, type ActiveChip } from "./active-filter-chips";
import { FilterSidebar } from "./filter-sidebar";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { PartnerGrid } from "./partner-grid";
import { LoadMoreButton } from "./load-more-button";

const SERVICE_SLUG_TO_LABEL = new Map(categories.map((c) => [c.slug, c.name]));
const SERVICE_LABEL_TO_SLUG = new Map(categories.map((c) => [c.name, c.slug]));

const COUNTRY_CODE_TO_LABEL: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
};
const COUNTRY_LABEL_TO_CODE: Record<string, string> = {
  "United States": "US",
  Canada: "CA",
  "United Kingdom": "GB",
};

const SERVER_SORT_VALUES = ["relevance", "rating", "reviews", "name"] as const;
type ServerSort = (typeof SERVER_SORT_VALUES)[number];

// Filter-sidebar/page-header use SortValue ("relevance" | "rating" | "reviews" | "newest").
// The server understands "name" instead of "newest". Map between them so we
// can reuse the existing SortDropdown UI without redesign.
const SORT_UI_TO_SERVER: Record<SortValue, ServerSort> = {
  relevance: "relevance",
  rating: "rating",
  reviews: "reviews",
  newest: "name",
};
const SORT_SERVER_TO_UI: Record<ServerSort, SortValue> = {
  relevance: "relevance",
  rating: "rating",
  reviews: "reviews",
  name: "newest",
};

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return false;
  return true;
}

export function DirectorySearchView({
  partners,
  total,
  page,
  perPage,
  facets,
}: {
  partners: Partner[];
  total: number;
  page: number;
  perPage: number;
  facets: DirectoryFacets;
}) {
  // URL-bound state (server-evaluated). `shallow: false` triggers server
  // re-render so getDirectoryPartners + getDirectoryFacets run with new args.
  const [qParam, setQParam] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false, throttleMs: 300 })
  );
  const [serviceSlugs, setServiceSlugs] = useQueryState(
    "services",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false, history: "push" })
  );
  const [countryParam, setCountryParam] = useQueryState(
    "country",
    parseAsString.withDefault("").withOptions({ shallow: false, history: "push" })
  );
  const [stateParam, setStateParam] = useQueryState(
    "state",
    parseAsString.withDefault("").withOptions({ shallow: false, history: "push" })
  );
  const [sortServer, setSortServer] = useQueryState(
    "sort",
    parseAsStringEnum<ServerSort>([...SERVER_SORT_VALUES])
      .withDefault("relevance")
      .withOptions({ shallow: false, history: "push" })
  );
  const [urlPage, setUrlPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false, history: "push" })
  );
  // Presentation-only: view is grid|rows. Uses shallow:true so toggling doesn't
  // trigger a server refetch + skeleton flicker — the other six keys above are
  // server-bound (shallow:false) by design.
  const [view, setView] = useQueryState(
    "view",
    parseAsStringEnum<"rows" | "grid">(["rows", "grid"])
      .withDefault("rows")
      .withOptions({ shallow: true, history: "push", clearOnDefault: true })
  );

  // Local-only state (client-side filters that don't change server data).
  const [clientFilters, setClientFilters] = useState<Filters>(() => emptyFilters());

  // Skeleton flash while server data is in flight (cheap proxy: detect prop
  // changes via an effect token).
  const [pending, setPending] = useState(false);
  const showSkeletons = useDebouncedLoading(pending, 200);
  useEffect(() => {
    // Whenever partners or total prop changes, the server fetch has landed.
    setPending(false);
  }, [partners, total]);

  // ── Compose the Filters object the existing sidebar UI expects ──────────
  const sidebarFilters: Filters = useMemo(() => {
    const services = new Set<string>();
    for (const slug of serviceSlugs) {
      services.add(SERVICE_SLUG_TO_LABEL.get(slug) ?? slug);
    }
    const locations = new Set<string>();
    if (countryParam) {
      locations.add(COUNTRY_CODE_TO_LABEL[countryParam] ?? countryParam);
    }
    if (stateParam) {
      locations.add(STATE_SLUG_TO_NAME[stateParam] ?? stateParam);
    }
    return {
      search: qParam,
      services,
      locations,
      integrations: clientFilters.integrations,
      certifications: clientFilters.certifications,
      volume: clientFilters.volume,
      rating: clientFilters.rating,
      quickFilters: clientFilters.quickFilters,
    };
  }, [qParam, serviceSlugs, countryParam, stateParam, clientFilters]);

  // ── Translate sidebar onChange back into URL setters ────────────────────
  const onChangeFilters = (next: Filters) => {
    let dirtyUrlBound = false;

    // q
    if (next.search !== qParam) {
      setQParam(next.search || null);
      dirtyUrlBound = true;
    }

    // services (Filters.services holds DISPLAY names; URL holds slugs)
    const nextSlugs = Array.from(next.services)
      .map((label) => SERVICE_LABEL_TO_SLUG.get(label))
      .filter((s): s is string => Boolean(s));
    if (!arraysEqual(nextSlugs, serviceSlugs)) {
      setServiceSlugs(nextSlugs.length > 0 ? nextSlugs : null);
      dirtyUrlBound = true;
    }

    // locations → country + state (single-select for each)
    let nextCountry = "";
    let nextState = "";
    for (const token of next.locations) {
      const code = COUNTRY_LABEL_TO_CODE[token];
      if (code) {
        nextCountry = code;
        continue;
      }
      const slug = STATE_NAME_TO_SLUG[token];
      if (slug) nextState = slug;
    }
    if (nextCountry !== countryParam) {
      setCountryParam(nextCountry || null);
      dirtyUrlBound = true;
    }
    if (nextState !== stateParam) {
      setStateParam(nextState || null);
      dirtyUrlBound = true;
    }

    if (dirtyUrlBound) {
      setPending(true);
      // Reset to first page on any URL-bound filter change so users don't end
      // up on an out-of-range page.
      if (urlPage !== 1) setUrlPage(null);
    }

    // Local-only fields
    setClientFilters({
      // search/services/locations are intentionally URL-bound and stripped here
      search: "",
      services: new Set(),
      locations: new Set(),
      integrations: next.integrations,
      certifications: next.certifications,
      volume: next.volume,
      rating: next.rating,
      quickFilters: next.quickFilters,
    });
  };

  const onClearAll = () => {
    setQParam(null);
    setServiceSlugs(null);
    setCountryParam(null);
    setStateParam(null);
    setUrlPage(null);
    setClientFilters(emptyFilters());
    setPending(true);
  };

  const onToggleQuickFilter = (chip: string) => {
    const next = new Set(clientFilters.quickFilters);
    if (next.has(chip)) next.delete(chip);
    else next.add(chip);
    setClientFilters({ ...clientFilters, quickFilters: next });
  };

  const onSortChange = (uiValue: SortValue) => {
    const serverValue = SORT_UI_TO_SERVER[uiValue];
    if (serverValue !== sortServer) {
      setSortServer(serverValue);
      setPending(true);
    }
  };

  const onLoadMore = () => {
    setUrlPage(urlPage + 1);
    setPending(true);
  };

  // Apply only the client-only dimensions (server already filtered the rest).
  const filtered = useMemo(
    () => applyClientOnlyFilters(partners, clientFilters),
    [partners, clientFilters]
  );

  const remaining = Math.max(total - partners.length, 0);

  // Active filter chips
  const chips: ActiveChip[] = useMemo(() => {
    const out: ActiveChip[] = [];
    if (qParam.trim()) {
      out.push({
        id: `search-${qParam}`,
        label: `Search: "${qParam}"`,
        onRemove: () => {
          setQParam(null);
          setPending(true);
          if (urlPage !== 1) setUrlPage(null);
        },
      });
    }
    for (const slug of serviceSlugs) {
      const label = SERVICE_SLUG_TO_LABEL.get(slug) ?? slug;
      out.push({
        id: `services-${slug}`,
        label: `Service: ${label}`,
        onRemove: () => {
          const next = serviceSlugs.filter((s) => s !== slug);
          setServiceSlugs(next.length > 0 ? next : null);
          setPending(true);
          if (urlPage !== 1) setUrlPage(null);
        },
      });
    }
    if (countryParam) {
      const label = COUNTRY_CODE_TO_LABEL[countryParam] ?? countryParam;
      out.push({
        id: `country-${countryParam}`,
        label: `Location: ${label}`,
        onRemove: () => {
          setCountryParam(null);
          setPending(true);
          if (urlPage !== 1) setUrlPage(null);
        },
      });
    }
    if (stateParam) {
      const label = STATE_SLUG_TO_NAME[stateParam] ?? stateParam;
      out.push({
        id: `state-${stateParam}`,
        label: `Location: ${label}`,
        onRemove: () => {
          setStateParam(null);
          setPending(true);
          if (urlPage !== 1) setUrlPage(null);
        },
      });
    }
    for (const value of clientFilters.integrations) {
      out.push({
        id: `integrations-${value}`,
        label: value,
        onRemove: () => {
          const next = new Set(clientFilters.integrations);
          next.delete(value);
          setClientFilters({ ...clientFilters, integrations: next });
        },
      });
    }
    for (const value of clientFilters.certifications) {
      out.push({
        id: `certifications-${value}`,
        label: value,
        onRemove: () => {
          const next = new Set(clientFilters.certifications);
          next.delete(value);
          setClientFilters({ ...clientFilters, certifications: next });
        },
      });
    }
    for (const value of clientFilters.quickFilters) {
      out.push({
        id: `quick-${value}`,
        label: value,
        onRemove: () => {
          const next = new Set(clientFilters.quickFilters);
          next.delete(value);
          setClientFilters({ ...clientFilters, quickFilters: next });
        },
      });
    }
    if (clientFilters.volume !== "any") {
      const labels: Record<string, string> = {
        "100": "100+ orders/mo",
        "500": "500+ orders/mo",
        "1000": "1,000+ orders/mo",
      };
      out.push({
        id: "volume",
        label: labels[clientFilters.volume] ?? clientFilters.volume,
        onRemove: () =>
          setClientFilters({ ...clientFilters, volume: "any" }),
      });
    }
    if (clientFilters.rating !== "any") {
      out.push({
        id: "rating",
        label: `${clientFilters.rating}+ stars`,
        onRemove: () =>
          setClientFilters({ ...clientFilters, rating: "any" }),
      });
    }
    return out;
  }, [
    qParam,
    serviceSlugs,
    countryParam,
    stateParam,
    clientFilters,
    urlPage,
    setQParam,
    setServiceSlugs,
    setCountryParam,
    setStateParam,
    setUrlPage,
  ]);

  const anyFilterActive =
    qParam.trim() !== "" ||
    serviceSlugs.length > 0 ||
    countryParam !== "" ||
    stateParam !== "" ||
    hasAnyFilter({
      ...emptyFilters(),
      integrations: clientFilters.integrations,
      certifications: clientFilters.certifications,
      volume: clientFilters.volume,
      rating: clientFilters.rating,
      quickFilters: clientFilters.quickFilters,
    });

  // Items for the Service Type checkbox list: labels + counts from the facet
  // RPC. Items not currently selected disappear from the facet when their
  // count drops to 0; we still want them visible if selected.
  const serviceItems = useMemo(() => {
    const byLabel = new Map<string, number>();
    for (const f of facets.services) {
      byLabel.set(f.label, f.count);
    }
    // Make sure currently-selected services are present even if count = 0.
    for (const slug of serviceSlugs) {
      const label = SERVICE_SLUG_TO_LABEL.get(slug) ?? slug;
      if (!byLabel.has(label)) byLabel.set(label, 0);
    }
    // Sort by count desc, then label asc.
    return Array.from(byLabel.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [facets.services, serviceSlugs]);

  const countryCounts = useMemo<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const f of facets.countries) out[f.value] = f.count;
    return out;
  }, [facets.countries]);

  const sortUiValue: SortValue = SORT_SERVER_TO_UI[sortServer];

  return (
    <>
      <DirectoryPageHeader
        total={total}
        visible={filtered.length}
        sort={sortUiValue}
        onSortChange={onSortChange}
        view={view}
        onViewChange={setView}
      />

      <div className="bg-background pb-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          <div className="pt-8">
            <QuickFilterStrip
              active={clientFilters.quickFilters}
              onToggle={onToggleQuickFilter}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FilterSidebar
                  filters={sidebarFilters}
                  onChange={onChangeFilters}
                  onClearAll={onClearAll}
                  serviceItems={serviceItems}
                  countryCounts={countryCounts}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col gap-4 lg:hidden">
                <MobileFilterDrawer
                  filters={sidebarFilters}
                  onChange={onChangeFilters}
                  onClearAll={onClearAll}
                  activeCount={chips.length}
                  serviceItems={serviceItems}
                  countryCounts={countryCounts}
                />
              </div>

              {chips.length > 0 && (
                <div className="mb-6 mt-6 lg:mt-0">
                  <ActiveFilterChips
                    chips={chips}
                    onClearAll={anyFilterActive ? onClearAll : undefined}
                  />
                </div>
              )}

              <PartnerGrid
                partners={filtered}
                loading={showSkeletons}
                onClearFilters={onClearAll}
                view={view}
              />

              <LoadMoreButton onClick={onLoadMore} remaining={remaining} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
