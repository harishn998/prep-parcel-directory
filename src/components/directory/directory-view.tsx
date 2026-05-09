"use client";

import { useEffect, useMemo, useState } from "react";
import {
  partners as allPartners,
  type Partner,
  type SortValue,
} from "@/lib/sample-data";
import {
  applyFilters,
  applySort,
  emptyFilters,
  hasAnyFilter,
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

const PAGE_SIZE = 6;

export function DirectoryView({
  partners = allPartners,
  initialFilters,
  lockedServices,
  lockedLocations,
  hidePageHeader = false,
  hideQuickFilters = false,
}: {
  partners?: Partner[];
  initialFilters?: Filters;
  lockedServices?: Set<string>;
  lockedLocations?: Set<string>;
  hidePageHeader?: boolean;
  hideQuickFilters?: boolean;
} = {}) {
  const [filters, setFilters] = useState<Filters>(
    () => initialFilters ?? emptyFilters()
  );
  const [sort, setSort] = useState<SortValue>("relevance");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filterPulse, setFilterPulse] = useState(0);
  const [filtering, setFiltering] = useState(false);
  const showSkeletons = useDebouncedLoading(filtering, 200);

  // Reset paging when filters/sort change; emulate brief async to flash skeletons.
  useEffect(() => {
    setFiltering(true);
    setVisible(PAGE_SIZE);
    const t = window.setTimeout(() => setFiltering(false), 280);
    return () => window.clearTimeout(t);
  }, [filterPulse, sort]);

  const onChangeFilters = (next: Filters) => {
    // Make sure locked filters can't be removed via state changes elsewhere
    if (lockedServices) {
      const merged = new Set(next.services);
      for (const v of lockedServices) merged.add(v);
      next = { ...next, services: merged };
    }
    if (lockedLocations) {
      const merged = new Set(next.locations);
      for (const v of lockedLocations) merged.add(v);
      next = { ...next, locations: merged };
    }
    setFilters(next);
    setFilterPulse((n) => n + 1);
  };

  const onClearAll = () => {
    // Preserve locks when clearing
    const next = emptyFilters();
    if (lockedServices) for (const v of lockedServices) next.services.add(v);
    if (lockedLocations) for (const v of lockedLocations) next.locations.add(v);
    onChangeFilters(next);
  };

  const onToggleQuickFilter = (chip: string) => {
    const next = new Set(filters.quickFilters);
    if (next.has(chip)) next.delete(chip);
    else next.add(chip);
    onChangeFilters({ ...filters, quickFilters: next });
  };

  const filtered = useMemo(
    () => applySort(applyFilters(partners, filters), sort),
    [partners, filters, sort]
  );

  const visiblePartners = filtered.slice(0, visible);
  const remaining = Math.max(filtered.length - visible, 0);

  // Build chip list for the active-filter strip. Locked items render with no
  // remove button and are styled differently.
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
      lockedSet?: Set<string>,
      prefix?: string
    ) =>
      Array.from(filters[key]).forEach((value) => {
        const isLocked = lockedSet?.has(value) ?? false;
        out.push({
          id: `${key}-${value}`,
          label: prefix ? `${prefix}: ${value}` : value,
          locked: isLocked,
          onRemove: () => {
            if (isLocked) return;
            const next = new Set(filters[key]);
            next.delete(value);
            onChangeFilters({ ...filters, [key]: next });
          },
        });
      });
    setChips("services", lockedServices, "Service");
    setChips("locations", lockedLocations, "Location");
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
  }, [filters, lockedServices, lockedLocations]);

  // Whether "Clear all" should be offered (only when there are removable filters)
  const offerClearAll = (() => {
    const removable = chips.filter((c) => !c.locked);
    return removable.length > 0 && hasAnyFilter(filters);
  })();

  return (
    <>
      {!hidePageHeader && (
        <DirectoryPageHeader
          total={partners.length}
          visible={visiblePartners.length}
          sort={sort}
          onSortChange={setSort}
        />
      )}

      <div className="bg-background pb-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8">
          {!hideQuickFilters && (
            <div className="pt-8">
              <QuickFilterStrip
                active={filters.quickFilters}
                onToggle={onToggleQuickFilter}
              />
            </div>
          )}

          <div
            className={[
              "grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12",
              hideQuickFilters ? "mt-8" : "mt-8",
            ].join(" ")}
          >
            {/* Sidebar (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onChange={onChangeFilters}
                  onClearAll={onClearAll}
                  lockedServices={lockedServices}
                  lockedLocations={lockedLocations}
                />
              </div>
            </div>

            <div className="flex flex-col">
              {/* Mobile controls */}
              <div className="flex flex-col gap-4 lg:hidden">
                <MobileFilterDrawer
                  filters={filters}
                  onChange={onChangeFilters}
                  onClearAll={onClearAll}
                  activeCount={chips.length}
                  lockedServices={lockedServices}
                  lockedLocations={lockedLocations}
                />
              </div>

              {chips.length > 0 && (
                <div className="mb-6 mt-6 lg:mt-0">
                  <ActiveFilterChips
                    chips={chips}
                    onClearAll={offerClearAll ? onClearAll : undefined}
                  />
                </div>
              )}

              {hidePageHeader && (
                <div className="mb-4 flex items-center justify-between text-[13px] text-text-2">
                  <span>
                    Showing{" "}
                    <span data-numeric className="font-medium text-text">
                      {visiblePartners.length}
                    </span>{" "}
                    of{" "}
                    <span data-numeric className="font-medium text-text">
                      {filtered.length}
                    </span>{" "}
                    partners
                  </span>
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
