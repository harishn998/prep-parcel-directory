"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortOptions, type SortValue } from "@/lib/sample-data";

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortValue)}>
      <SelectTrigger className="h-10 w-[180px] border-border-soft bg-surface text-[14px] font-medium text-text">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
