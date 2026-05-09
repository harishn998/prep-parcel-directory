"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Lock } from "lucide-react";
import { usStates } from "@/lib/sample-data";

const countries = [
  { name: "United States", code: "US", regions: usStates },
  {
    name: "Canada",
    code: "CA",
    regions: ["Ontario", "British Columbia", "Alberta"],
  },
  { name: "United Kingdom", code: "GB", regions: ["England", "Scotland"] },
];

export function LocationTree({
  selected,
  onToggle,
  lockedSet,
}: {
  selected: Set<string>;
  onToggle: (value: string) => void;
  lockedSet?: Set<string>;
}) {
  // Pick the country to default-open: if a region is locked, open the matching country.
  const defaultOpen = (() => {
    if (!lockedSet || lockedSet.size === 0) return "US";
    for (const country of countries) {
      for (const region of country.regions) {
        if (lockedSet.has(region)) return country.code;
      }
      if (lockedSet.has(country.name)) return country.code;
    }
    return "US";
  })();

  const [open, setOpen] = useState<string | null>(defaultOpen);

  return (
    <div className="space-y-2">
      {countries.map((country) => {
        const isOpen = open === country.code;
        const countryId = `loc-${country.code}`;
        const countryLocked = lockedSet?.has(country.name) ?? false;
        const countryChecked = selected.has(country.name) || countryLocked;
        return (
          <div
            key={country.code}
            className="border-b border-border-soft pb-2 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor={countryId}
                className={[
                  "flex items-center gap-2.5 text-[14px] transition-colors duration-200",
                  countryLocked
                    ? "cursor-default text-text-3"
                    : "cursor-pointer text-text-2 hover:text-text",
                ].join(" ")}
              >
                <Checkbox
                  id={countryId}
                  checked={countryChecked}
                  onCheckedChange={() => {
                    if (!countryLocked) onToggle(country.name);
                  }}
                  disabled={countryLocked}
                  className="border-border-soft data-[state=checked]:border-blue data-[state=checked]:bg-blue disabled:opacity-100"
                />
                <span className="font-medium">{country.name}</span>
                {countryLocked && (
                  <Lock
                    className="h-3 w-3 text-text-3"
                    strokeWidth={2}
                    aria-label="Locked filter"
                  />
                )}
              </label>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : country.code)}
                aria-label={`${isOpen ? "Collapse" : "Expand"} ${country.name}`}
                className="rounded-md p-1 text-text-3 transition-colors duration-200 hover:bg-secondary hover:text-text"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2}
                />
              </button>
            </div>
            {isOpen && (
              <div className="mt-2 ml-6 space-y-2">
                {country.regions.map((region) => {
                  const id = `loc-${country.code}-${region.replace(/\s+/g, "-")}`;
                  const regionLocked = lockedSet?.has(region) ?? false;
                  const regionChecked = selected.has(region) || regionLocked;
                  return (
                    <label
                      key={region}
                      htmlFor={id}
                      className={[
                        "flex items-center gap-2.5 text-[13px] transition-colors duration-200",
                        regionLocked
                          ? "cursor-default text-text-3"
                          : "cursor-pointer text-text-2 hover:text-text",
                      ].join(" ")}
                    >
                      <Checkbox
                        id={id}
                        checked={regionChecked}
                        onCheckedChange={() => {
                          if (!regionLocked) onToggle(region);
                        }}
                        disabled={regionLocked}
                        className="border-border-soft data-[state=checked]:border-blue data-[state=checked]:bg-blue disabled:opacity-100"
                      />
                      <span>{region}</span>
                      {regionLocked && (
                        <Lock
                          className="h-3 w-3 text-text-3"
                          strokeWidth={2}
                          aria-label="Locked filter"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
