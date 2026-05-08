"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadMoreButton({
  onClick,
  remaining,
}: {
  onClick: () => void;
  remaining: number;
}) {
  if (remaining <= 0) return null;
  return (
    <div className="mt-12 flex justify-center">
      <Button
        variant="outline"
        onClick={onClick}
        className="h-11 border-border-soft px-6 text-[14px] font-medium text-navy hover:border-blue hover:text-blue"
      >
        Load more
        <span data-numeric className="ml-2 text-text-3">
          ({remaining})
        </span>
        <ChevronDown className="ml-1 h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
}
