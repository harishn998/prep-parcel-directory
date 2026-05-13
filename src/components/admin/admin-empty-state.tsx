import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-text-3">
          {icon}
        </div>
      ) : null}
      <div className="text-[14px] font-medium text-text">{title}</div>
      {description ? (
        <div className="mt-1 max-w-md text-[13px] text-text-2">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
