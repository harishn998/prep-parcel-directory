"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterSidebar, type Filters } from "./filter-sidebar";

export function MobileFilterDrawer({
  filters,
  onChange,
  onClearAll,
  activeCount,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            className="h-10 border-border-soft bg-surface px-4 text-[14px] font-medium text-navy hover:border-blue hover:text-blue lg:hidden"
          />
        }
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" strokeWidth={2} />
        Filters
        {activeCount > 0 && (
          <span
            data-numeric
            className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue px-1.5 text-[11px] text-white"
          >
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] overflow-y-auto bg-surface p-6">
        <SheetHeader className="mb-4 px-0">
          <SheetTitle className="text-[18px] font-semibold tracking-[-0.01em] text-text">
            Filters
          </SheetTitle>
          <SheetDescription className="text-[13px] text-text-2">
            Narrow the directory by service, location, and more.
          </SheetDescription>
        </SheetHeader>
        <FilterSidebar
          filters={filters}
          onChange={onChange}
          onClearAll={onClearAll}
        />
      </SheetContent>
    </Sheet>
  );
}
