"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Lock } from "lucide-react";

type Item = { name: string; count?: number };

export function CheckboxList({
  items,
  selected,
  onToggle,
  initialVisible = 6,
  lockedSet,
}: {
  items: Item[];
  selected: Set<string>;
  onToggle: (name: string) => void;
  initialVisible?: number;
  lockedSet?: Set<string>;
}) {
  const [showAll, setShowAll] = useState(false);
  const hasMore = items.length > initialVisible;
  const visible = showAll ? items : items.slice(0, initialVisible);

  return (
    <div className="space-y-2.5">
      {visible.map((item) => {
        const id = `cb-${item.name.replace(/\s+/g, "-").toLowerCase()}`;
        const isLocked = lockedSet?.has(item.name) ?? false;
        const isChecked = selected.has(item.name) || isLocked;
        return (
          <label
            key={item.name}
            htmlFor={id}
            className={[
              "flex items-center justify-between gap-3 text-[14px] transition-colors duration-200",
              isLocked
                ? "cursor-default text-text-3"
                : "cursor-pointer text-text-2 hover:text-text",
            ].join(" ")}
          >
            <span className="flex items-center gap-2.5">
              <Checkbox
                id={id}
                checked={isChecked}
                onCheckedChange={() => {
                  if (!isLocked) onToggle(item.name);
                }}
                disabled={isLocked}
                className="border-border-soft data-[state=checked]:border-blue data-[state=checked]:bg-blue disabled:opacity-100"
              />
              <span>{item.name}</span>
              {isLocked && (
                <Lock
                  className="h-3 w-3 text-text-3"
                  strokeWidth={2}
                  aria-label="Locked filter"
                />
              )}
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
