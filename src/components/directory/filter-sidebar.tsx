"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckboxList } from "./checkbox-list";
import { LocationTree } from "./location-tree";
import { VolumeRadio } from "./volume-radio";
import { RatingRadio } from "./rating-radio";
import {
  serviceFilters,
  integrationFilters,
  certificationFilters,
} from "@/lib/static-data";
import {
  type Filters,
  emptyFilters,
  hasAnyFilter,
} from "@/lib/filter-logic";

// Re-export so existing call sites importing from filter-sidebar still work.
export { emptyFilters, hasAnyFilter };
export type { Filters };

function toggleSet(prev: Set<string>, value: string): Set<string> {
  const next = new Set(prev);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function FilterSidebar({
  filters,
  onChange,
  onClearAll,
  lockedServices,
  lockedLocations,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClearAll: () => void;
  lockedServices?: Set<string>;
  lockedLocations?: Set<string>;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const toggle = (key: "services" | "locations" | "integrations" | "certifications") =>
    (value: string) => {
      // Don't allow toggling locked items off
      if (key === "services" && lockedServices?.has(value)) return;
      if (key === "locations" && lockedLocations?.has(value)) return;
      set(key, toggleSet(filters[key], value));
    };

  return (
    <aside aria-label="Filters" className="flex flex-col gap-5">
      {hasAnyFilter(filters) && (
        <button
          type="button"
          onClick={onClearAll}
          className="self-start text-[13px] font-medium text-blue underline-offset-4 transition-colors duration-200 hover:text-navy hover:underline"
        >
          Clear all filters
        </button>
      )}

      <div>
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">
          Search within results
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3"
            strokeWidth={2}
          />
          <Input
            type="search"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search partner name..."
            className="h-10 border-border-soft bg-surface pl-9 text-[14px]"
          />
        </div>
      </div>

      <Separator className="bg-border-soft" />

      <Accordion
        defaultValue={["services", "location", "rating"]}
        className="space-y-1"
      >
        <FilterAccordion value="services" label="Service Type">
          <CheckboxList
            items={serviceFilters}
            selected={filters.services}
            onToggle={toggle("services")}
            initialVisible={6}
            lockedSet={lockedServices}
          />
        </FilterAccordion>

        <FilterAccordion value="location" label="Location">
          <LocationTree
            selected={filters.locations}
            onToggle={toggle("locations")}
            lockedSet={lockedLocations}
          />
        </FilterAccordion>

        <FilterAccordion value="integrations" label="Integrations">
          <CheckboxList
            items={integrationFilters.map((name) => ({ name }))}
            selected={filters.integrations}
            onToggle={toggle("integrations")}
            initialVisible={6}
          />
        </FilterAccordion>

        <FilterAccordion value="certifications" label="Certifications">
          <CheckboxList
            items={certificationFilters.map((name) => ({ name }))}
            selected={filters.certifications}
            onToggle={toggle("certifications")}
            initialVisible={5}
          />
        </FilterAccordion>

        <FilterAccordion value="volume" label="Minimum Order Volume">
          <VolumeRadio
            value={filters.volume}
            onChange={(v) => set("volume", v)}
          />
        </FilterAccordion>

        <FilterAccordion value="rating" label="Rating">
          <RatingRadio
            value={filters.rating}
            onChange={(v) => set("rating", v)}
          />
        </FilterAccordion>
      </Accordion>
    </aside>
  );
}

function FilterAccordion({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={value}
      className="border-b border-border-soft last:border-b-0"
    >
      <AccordionTrigger className="py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-text-2 hover:no-underline">
        {label}
      </AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
