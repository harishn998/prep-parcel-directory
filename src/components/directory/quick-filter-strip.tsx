"use client";

import { directoryQuickFilters } from "@/lib/static-data";

export function QuickFilterStrip({
  active,
  onToggle,
}: {
  active: Set<string>;
  onToggle: (chip: string) => void;
}) {
  return (
    <div
      className="-mx-6 overflow-x-auto px-6 pb-1 md:-mx-8 md:px-8"
      style={{ scrollbarWidth: "none" }}
      aria-label="Quick filters"
    >
      <div className="flex w-max items-center gap-2">
        {directoryQuickFilters.map((chip) => {
          const isActive = active.has(chip);
          return (
            <button
              key={chip}
              type="button"
              onClick={() => onToggle(chip)}
              className={[
                "h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "border-indigo bg-indigo text-white shadow-sm"
                  : "border-border-soft bg-surface text-text-2 hover:border-indigo hover:text-navy",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}
