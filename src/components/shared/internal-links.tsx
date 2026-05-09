import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type InternalLinkItem = {
  name: string;
  href: string;
  description?: string;
  meta?: string; // e.g. "12 partners"
};

export function InternalLinks({
  title,
  links,
  columns = 3,
}: {
  title?: string;
  links: InternalLinkItem[];
  columns?: 2 | 3 | 4;
}) {
  if (!links || links.length === 0) return null;
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];
  return (
    <section>
      {title && (
        <h2 className="mb-6 text-[24px] font-semibold tracking-[-0.02em] text-text md:text-[28px]">
          {title}
        </h2>
      )}
      <div className={`grid grid-cols-1 gap-4 ${colClass}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="lift-card group flex items-start justify-between gap-4 rounded-xl border border-border-soft bg-surface p-5"
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-text group-hover:text-blue">
                {link.name}
              </p>
              {link.meta && (
                <p className="mt-1 text-[12px] font-medium text-text-3">
                  <span data-numeric>{link.meta}</span>
                </p>
              )}
              {link.description && (
                <p className="mt-2 text-[13px] leading-[1.55] text-text-2">
                  {link.description}
                </p>
              )}
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-text-3 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue"
              strokeWidth={2}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
