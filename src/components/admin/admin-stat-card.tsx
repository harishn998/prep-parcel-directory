import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: React.ReactNode;
  className?: string;
  /** When set, the whole card becomes a link. */
  href?: string;
}

export function AdminStatCard({
  label,
  value,
  detail,
  icon,
  className,
  href,
}: AdminStatCardProps) {
  const Root = href ? Link : "div";
  return (
    <Root
      // @ts-expect-error - href only applies when Root is Link
      href={href}
      className={cn(
        "block rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-sm",
        href && "hover:border-blue/40",
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
    </Root>
  );
}
