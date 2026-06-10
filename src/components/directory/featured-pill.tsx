"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Indigo "Featured" pill for the top-right corner of a featured partner's
// card/row. Flat indigo-soft at rest; the .featured-pill class adds a faint
// indigo→coral gradient on hover (see globals.css).
export function FeaturedPill({ className }: { className?: string }) {
  const trigger = (
    <span
      className={cn(
        "featured-pill inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-indigo-soft px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-indigo",
        className
      )}
    >
      Featured
    </span>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={trigger} />
        <TooltipContent>
          Featured partner — top-rated in their category.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
