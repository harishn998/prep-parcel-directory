import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-soft bg-surface px-6 py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-text-3">
        <SearchX className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-text">
        No partners match your filters.
      </h3>
      <p className="mt-2 max-w-sm text-[14px] leading-[1.65] text-text-2">
        Try widening your service or location filters, or remove a few requirements
        and we&rsquo;ll find more partners.
      </p>
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="mt-6 h-10 border-border-soft px-5 text-[14px] font-medium text-navy hover:border-blue hover:text-blue"
      >
        Clear filters
      </Button>
    </div>
  );
}
