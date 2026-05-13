import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-text md:text-[32px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-[14px] leading-relaxed text-text-2">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
