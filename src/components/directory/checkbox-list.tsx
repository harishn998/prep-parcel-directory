"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

type Item = { name: string; count?: number };

export function CheckboxList({
  items,
  selected,
  onToggle,
  initialVisible = 6,
}: {
  items: Item[];
  selected: Set<string>;
  onToggle: (name: string) => void;
  initialVisible?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const hasMore = items.length > initialVisible;
  const visible = showAll ? items : items.slice(0, initialVisible);

  return (
    <div className="space-y-2.5">
      {visible.map((item) => {
        const id = `cb-${item.name.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <label
            key={item.name}
            htmlFor={id}
            className="flex cursor-pointer items-center justify-between gap-3 text-[14px] text-text-2 transition-colors duration-200 hover:text-text"
          >
            <span className="flex items-center gap-2.5">
              <Checkbox
                id={id}
                checked={selected.has(item.name)}
                onCheckedChange={() => onToggle(item.name)}
                className="border-border-soft data-[state=checked]:border-blue data-[state=checked]:bg-blue"
              />
              <span>{item.name}</span>
            </span>
            {typeof item.count === "number" && (
              <span data-numeric className="text-[12px] text-text-3">
                {item.count}
              </span>
            )}
          </label>
        );
      })}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-blue transition-colors duration-200 hover:text-navy"
        >
          {showAll ? "Show fewer" : "Show all"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              showAll ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </button>
      )}
    </div>
  );
}
