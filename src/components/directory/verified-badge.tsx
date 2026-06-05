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

const SIZE_CLASS: Record<Size, string> = {
  sm: "gap-1 px-2 py-0.5 text-[11px]",
  md: "gap-1.5 px-2.5 py-1 text-[12px]",
};

const ICON_CLASS: Record<Size, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
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
  const trigger =
    variant === "inline" ? (
      <span
        className={cn(
          "inline-flex shrink-0 items-center text-success",
          className
        )}
      >
        <BadgeCheck className={ICON_CLASS[size]} strokeWidth={2.5} />
        <span className="sr-only">Verified partner</span>
      </span>
    ) : (
      <span
        className={cn(
          "inline-flex shrink-0 items-center rounded-full bg-success/10 font-medium text-success",
          SIZE_CLASS[size],
          className
        )}
      >
        <BadgeCheck className={ICON_CLASS[size]} strokeWidth={2.5} />
        Verified
      </span>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={trigger} />
        <TooltipContent>
          Verified partner — credentials confirmed by AMZ Prep
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
