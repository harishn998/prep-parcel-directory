import { MapPin, Star, BadgeCheck } from "lucide-react";
import type { Partner } from "@/lib/sample-data";

export function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <a
      href={`#${partner.slug}`}
      className="lift-card group flex flex-col rounded-xl border border-border-soft bg-surface p-7"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border-soft bg-secondary text-[15px] font-semibold tracking-tight text-navy"
          aria-hidden
        >
          {partner.logoPlaceholder}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[17px] font-semibold tracking-[-0.01em] text-text">
              {partner.name}
            </h3>
            {partner.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-success"
                strokeWidth={2.5}
                aria-label="Verified partner"
              />
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-text-2">
            <MapPin className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
            <span>{partner.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        <Star
          className="h-4 w-4 fill-amber text-amber"
          strokeWidth={1.5}
          aria-hidden
        />
        <span className="text-[14px] font-medium text-text">
          <span data-numeric>{partner.rating.toFixed(1)}</span>
        </span>
        <span className="text-[13px] text-text-3">
          (<span data-numeric>{partner.reviewCount}</span> reviews)
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-[14px] leading-[1.55] text-text-2">
        {partner.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {partner.services.slice(0, 3).map((service) => (
          <span
            key={service}
            className="rounded-md border border-border-soft bg-background px-2.5 py-1 text-[12px] font-medium text-text-2"
          >
            {service}
          </span>
        ))}
      </div>
    </a>
  );
}
