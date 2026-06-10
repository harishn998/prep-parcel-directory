"use client";

import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";
type Variant = "pill" | "inline";

// Coral trust pill — loud-on-purpose. This is the "no pay-to-play" pitch made
// visible. Two flavors:
//   inline  → compact ~22px pill used next to a partner name on cards/rows
//   pill    → confident ~28px "Verified Partner" pill for the profile hero
const PILL_BASE =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-coral/40 bg-coral-soft align-middle font-mono uppercase tracking-[0.08em] text-coral";

const INLINE_CLASS = "gap-1 px-2 py-0.5 text-[11px]";
const PILL_CLASS: Record<Size, string> = {
  sm: "gap-1.5 px-2.5 py-1 text-[11px]",
  md: "gap-1.5 px-3 py-1 text-[12px]",
};

const ICON_CLASS: Record<Variant, string> = {
  inline: "h-3 w-3",
  pill: "h-3.5 w-3.5",
};

export function VerifiedBadge({
  size = "sm",
  variant = "pill",
  className,
}: {
  size?: Size;
  variant?: Variant;
  className?: string;
}) {
  const isInline = variant === "inline";
  const label = isInline ? "Verified" : "Verified Partner";

  const trigger = (
    <span
      className={cn(
        PILL_BASE,
        isInline ? INLINE_CLASS : PILL_CLASS[size],
        className
      )}
    >
      <BadgeCheck
        className={ICON_CLASS[variant]}
        strokeWidth={2.5}
        aria-hidden
      />
      {label}
    </span>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={trigger} />
        <TooltipContent>
          Vetted by AMZ Prep — credentials and reviews confirmed.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
