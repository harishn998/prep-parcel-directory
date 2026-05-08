"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { usStates } from "@/lib/sample-data";

const countries = [
  { name: "United States", code: "US", regions: usStates },
  { name: "Canada", code: "CA", regions: ["Ontario", "British Columbia", "Quebec"] },
  { name: "United Kingdom", code: "GB", regions: ["West Midlands", "North West England", "Greater London"] },
];

export function LocationTree({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState<string | null>("US");
  return (
    <div className="space-y-2">
      {countries.map((country) => {
        const isOpen = open === country.code;
        const countryId = `loc-${country.code}`;
        return (
          <div key={country.code} className="border-b border-border-soft pb-2 last:border-b-0">
            <div className="flex items-center justify-between">
              <label
                htmlFor={countryId}
                className="flex cursor-pointer items-center gap-2.5 text-[14px] text-text-2 transition-colors duration-200 hover:text-text"
              >
                <Checkbox
                  id={countryId}
                  checked={selected.has(country.name)}
                  onCheckedChange={() => onToggle(country.name)}
                  className="border-border-soft data-[state=checked]:border-blue data-[state=checked]:bg-blue"
                />
                <span className="font-medium">{country.name}</span>
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
                  return (
                    <label
                      key={region}
                      htmlFor={id}
                      className="flex cursor-pointer items-center gap-2.5 text-[13px] text-text-2 transition-colors duration-200 hover:text-text"
                    >
                      <Checkbox
                        id={id}
                        checked={selected.has(region)}
                        onCheckedChange={() => onToggle(region)}
                        className="border-border-soft data-[state=checked]:border-blue data-[state=checked]:bg-blue"
                      />
                      <span>{region}</span>
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
