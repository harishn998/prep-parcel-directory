"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, Rows3 } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SortDropdown } from "./sort-dropdown";
import type { SortValue } from "@/lib/static-data";
import { cn } from "@/lib/utils";

type View = "rows" | "grid";

function ViewToggle({
  value,
  onChange,
}: {
  value: View;
  onChange: (next: View) => void;
}) {
  return (
    <div
      role="group"
      aria-label="View"
      className="inline-flex items-center rounded-lg border border-border-soft bg-surface p-0.5"
    >
      <button
        type="button"
        onClick={() => onChange("rows")}
        aria-pressed={value === "rows"}
        aria-label="Row view"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          value === "rows"
            ? "bg-navy text-white"
            : "text-text-3 hover:bg-secondary hover:text-text"
        )}
      >
        <Rows3 className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={value === "grid"}
        aria-label="Grid view"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          value === "grid"
            ? "bg-navy text-white"
            : "text-text-3 hover:bg-secondary hover:text-text"
        )}
      >
        <LayoutGrid className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function CountNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return (
      <span data-numeric className="font-semibold text-navy">
        {value}
      </span>
    );
  }
  return (
    <span className="inline-block">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.18 }}
          data-numeric
          className="inline-block font-semibold text-navy"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function DirectoryPageHeader({
  total,
  visible,
  sort,
  onSortChange,
  view,
  onViewChange,
}: {
  total: number;
  visible: number;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
  view?: View;
  onViewChange?: (value: View) => void;
}) {
  const showToggle = Boolean(view && onViewChange);

  return (
    <div className="border-b border-border-soft bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-10 md:px-8 md:pt-16 md:pb-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Directory" }]}
        />
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] text-text md:text-[44px]">
              Browse 3PL &amp; Fulfillment Partners
            </h1>
            <p className="mt-3 text-[16px] leading-[1.65] text-text-2 md:text-[17px]">
              500+ vetted warehouses across USA, Canada, and the UK. Filter by
              service, location, integrations, and more.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="text-[13px] text-text-2">
              Showing <CountNumber value={visible} /> of{" "}
              <CountNumber value={total} />+ partners
            </p>
            <div className="flex items-center gap-2">
              {showToggle && view && onViewChange && (
                <ViewToggle value={view} onChange={onViewChange} />
              )}
              <SortDropdown value={sort} onChange={onSortChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
