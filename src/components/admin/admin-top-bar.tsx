"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";

const LABEL_OVERRIDES: Record<string, string> = {
  admin: "Admin",
  partners: "Partners",
  users: "Users",
  new: "New",
  settings: "Settings",
};

function labelForSegment(segment: string, isUuid: boolean): string {
  if (isUuid) return "Edit";
  return LABEL_OVERRIDES[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function AdminTopBar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname() ?? "/admin";
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isUuid = UUID_RE.test(seg);
    const label = labelForSegment(seg, isUuid);
    return { href, label };
  });

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-6"
      style={{ height: 64 }}
    >
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px]">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={c.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-text-3"
                  strokeWidth={2}
                  aria-hidden
                />
              )}
              {isLast ? (
                <span className="font-medium text-text">{c.label}</span>
              ) : (
                <Link
                  href={c.href}
                  className="text-text-2 transition-colors hover:text-text"
                >
                  {c.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-2 transition-colors hover:text-text"
        >
          <span>View public site</span>
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
        <div className="hidden text-[13px] text-text-3 md:block">
          {adminEmail}
        </div>
      </div>
    </header>
  );
}
