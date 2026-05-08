"use client";

import { useEffect, useMemo, useState } from "react";
import {
  partners as allPartners,
  type Partner,
  type SortValue,
} from "@/lib/sample-data";
import { useDebouncedLoading } from "@/hooks/use-debounced-loading";
import { DirectoryPageHeader } from "./page-header";
import { QuickFilterStrip } from "./quick-filter-strip";
import { ActiveFilterChips, type ActiveChip } from "./active-filter-chips";
import {
  FilterSidebar,
  emptyFilters,
  hasAnyFilter,
  type Filters,
} from "./filter-sidebar";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { PartnerGrid } from "./partner-grid";
import { LoadMoreButton } from "./load-more-button";

const PAGE_SIZE = 6;

const minRatingMap: Record<string, number> = {
  "4.5": 4.5,
  "4.0": 4.0,
  "3.5": 3.5,
  any: 0,
};

const minVolumeMap: Record<string, number> = {
  "1000": 1000,
  "500": 500,
  "100": 100,
  any: 0,
};

const partnerVolumeMap: Record<string, number> = {
  none: 0,
  "100": 100,
  "500": 500,
  "1000": 1000,
};

function applyFilters(items: Partner[], f: Filters): Partner[] {
  const search = f.search.trim().toLowerCase();
  const minRating = minRatingMap[f.rating];
  const minVolume = minVolumeMap[f.volume];
  const serviceFilter = new Set([
    ...Array.from(f.services),
    ...Array.from(f.quickFilters),
  ]);
  return items.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search)) return false;
    if (p.rating < minRating) return false;

    if (serviceFilter.size > 0) {
      const partnerServices = new Set(p.services);
      // Match if partner offers ANY of the selected services
      let hit = false;
      for (const s of serviceFilter) {
        if (partnerServices.has(s)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }

    if (f.locations.size > 0) {
      const matchesCountry =
        (f.locations.has("United States") && p.countryCode === "US") ||
        (f.locations.has("Canada") && p.countryCode === "CA") ||
        (f.locations.has("United Kingdom") && p.countryCode === "GB");
      const matchesRegion = f.locations.has(p.region);
      if (!matchesCountry && !matchesRegion) return false;
    }

    if (f.integrations.size > 0) {
      const partnerIntegrations = new Set(p.integrations);
      for (const i of f.integrations) {
        if (!partnerIntegrations.has(i)) return false;
      }
    }

    if (f.certifications.size > 0) {
      const partnerCerts = new Set(p.certifications);
      for (const c of f.certifications) {
        if (!partnerCerts.has(c)) return false;
      }
    }

    if (minVolume > 0 && partnerVolumeMap[p.minimumOrderVolume] < minVolume) {
      return false;
    }

    return true;
  });
}

function applySort(items: Partner[], sort: SortValue): Partner[] {
  const list = [...items];
  switch (sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "reviews":
      list.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
      list.sort((a, b) => b.yearFounded - a.yearFounded);
      break;
    default:
      // relevance: keep original order
      break;
  }
  return list;
}

export function DirectoryView() {
  const [filters, setFilters] = useState<Filters>(() => emptyFilters());
  const [sort, setSort] = useState<SortValue>("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filterPulse, setFilterPulse] = useState(0);
  const [filtering, setFiltering] = useState(false);
  const showSkeletons = useDebouncedLoading(filtering, 200);

  // Reset paging when filters change; emulate brief async to demonstrate skeleton.
  useEffect(() => {
    setFiltering(true);
    setVisible(PAGE_SIZE);
    const t = window.setTimeout(() => setFiltering(false), 280);
    return () => window.clearTimeout(t);
  }, [filterPulse, sort]);

  const onChangeFilters = (next: Filters) => {
    setFilters(next);
    setFilterPulse((n) => n + 1);
  };
  const onClearAll = () => onChangeFilters(emptyFilters());

  const onToggleQuickFilter = (chip: string) => {
    const next = new Set(filters.quickFilters);
    if (next.has(chip)) next.delete(chip);
    else next.add(chip);
    onChangeFilters({ ...filters, quickFilters: next });
  };

  const filtered = useMemo(
    () => applySort(applyFilters(allPartners, filters), sort),
    [filters, sort]
  );

  const visiblePartners = filtered.slice(0, visible);
  const remaining = Math.max(filtered.length - visible, 0);

  // Build chip list for the active-filter strip
  const chips: ActiveChip[] = useMemo(() => {
    const out: ActiveChip[] = [];
    if (filters.search.trim()) {
      out.push({
        id: `search-${filters.search}`,
        label: `Search: "${filters.search}"`,
        onRemove: () => onChangeFilters({ ...filters, search: "" }),
      });
    }
    const setChips = (
      key: "services" | "locations" | "integrations" | "certifications",
      prefix?: string
    ) =>
      Array.from(filters[key]).forEach((value) =>
        out.push({
          id: `${key}-${value}`,
          label: prefix ? `${prefix}: ${value}` : value,
          onRemove: () => {
            const next = new Set(filters[key]);
            next.delete(value);
            onChangeFilters({ ...filters, [key]: next });
          },
        })
      );
    setChips("services");
    setChips("locations", "Location");
    setChips("integrations");
    setChips("certifications");
    Array.from(filters.quickFilters).forEach((value) =>
      out.push({
        id: `quick-${value}`,
        label: value,
        onRemove: () => {
          const next = new Set(filters.quickFilters);
          next.delete(value);
          onChangeFilters({ ...filters, quickFilters: next });
        },
      })
    );
    if (filters.volume !== "any") {
      const labels: Record<string, string> = {
        "100": "100+ orders/mo",
        "500": "500+ orders/mo",
        "1000": "1,000+ orders/mo",
      };
      out.push({
        id: "volume",
        label: labels[filters.volume] ?? filters.volume,
        onRemove: () => onChangeFilters({ ...filters, volume: "any" }),
      });
    }
    if (filters.rating !== "any") {
      out.push({
        id: "rating",
        label: `${filters.rating}+ stars`,
        onRemove: () => onChangeFilters({ ...filters, rating: "any" }),
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <DirectoryPageHeader
        total={allPartners.length}
        visible={visiblePartners.length}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="bg-background pb-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          {/* Quick filters */}
          <div className="pt-8">
            <QuickFilterStrip
              active={filters.quickFilters}
              onToggle={onToggleQuickFilter}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
            {/* Sidebar (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onChange={onChangeFilters}
                  onClearAll={onClearAll}
                />
              </div>
            </div>

            <div className="flex flex-col">
              {/* Mobile controls + active chips */}
              <div className="flex flex-col gap-4 lg:hidden">
                <MobileFilterDrawer
                  filters={filters}
                  onChange={onChangeFilters}
                  onClearAll={onClearAll}
                  activeCount={chips.length}
                />
              </div>

              {chips.length > 0 && (
                <div className="mb-6 mt-6 lg:mt-0">
                  <ActiveFilterChips
                    chips={chips}
                    onClearAll={hasAnyFilter(filters) ? onClearAll : undefined}
                  />
                </div>
              )}

              <PartnerGrid
                partners={visiblePartners}
                loading={showSkeletons}
                onClearFilters={onClearAll}
              />

              <LoadMoreButton
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                remaining={remaining}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
