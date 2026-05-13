import * as React from "react";

import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  detail,
  icon,
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className="font-mono text-[11px] font-medium uppercase text-text-3"
          style={{ letterSpacing: "0.08em" }}
        >
          {label}
        </div>
        {icon ? (
          <div className="text-text-3" aria-hidden>
            {icon}
          </div>
        ) : null}
      </div>
      <div
        className="mt-3 font-mono text-[36px] font-semibold leading-none text-text"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      {detail ? (
        <div className="mt-2 text-[13px] text-text-2">{detail}</div>
      ) : null}
    </div>
  );
}
