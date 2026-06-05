import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { Partner } from "@/lib/data/types";

export function SimilarPartners({ partners }: { partners: Partner[] }) {
  return (
    <section className="shadow-card-static rounded-2xl border border-border-soft bg-surface p-6">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">
        Similar partners
      </h3>
      <ul className="mt-4 space-y-3">
        {partners.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/directory/${p.slug}`}
              className="lift-card group flex items-center gap-3 rounded-lg border border-border-soft bg-background p-3"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-soft bg-secondary text-[13px] font-semibold tracking-tight text-navy"
                aria-hidden
              >
                {p.logoPlaceholder}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold tracking-[-0.01em] text-text">
                  {p.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-text-2">
                  <MapPin className="h-3 w-3 text-text-3" strokeWidth={2} />
                  <span className="truncate">{p.location}</span>
                </span>
                <span className="mt-1 flex items-center gap-1 text-[12px] text-text-2">
                  <Star
                    className="h-3 w-3 fill-amber text-amber"
                    strokeWidth={1.5}
                  />
                  <span data-numeric className="font-medium text-text">
                    {p.rating.toFixed(1)}
                  </span>
                  <span className="text-text-3">
                    (<span data-numeric>{p.reviewCount}</span>)
                  </span>
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-text-3 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue"
                strokeWidth={2}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
