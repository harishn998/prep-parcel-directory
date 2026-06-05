import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import type { Partner } from "@/lib/data/types";
import { LogoOrInitials } from "./logo-or-initials";
import { ServicePill } from "./service-pill";
import { VerifiedBadge } from "./verified-badge";

const VOLUME_LABEL: Record<Partner["minimumOrderVolume"], string> = {
  none: "No minimum",
  "100": "100+/mo",
  "500": "500+/mo",
  "1000": "1,000+/mo",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-3">
        {label}
      </div>
      <div className="mt-0.5 truncate text-[14px] font-medium text-navy">
        {value}
      </div>
    </div>
  );
}

export function PartnerRow({ partner }: { partner: Partner }) {
  const extraServices = Math.max(partner.services.length - 3, 0);
  const years = partner.yearsInBusiness > 0
    ? `${partner.yearsInBusiness} yrs`
    : "—";
  const responseTime = partner.responseTime || "—";
  const minVolume = VOLUME_LABEL[partner.minimumOrderVolume];

  return (
    <Link
      href={`/directory/${partner.slug}`}
      className="shadow-card group flex cursor-pointer flex-col gap-4 rounded-2xl border border-border-soft bg-surface p-5 md:flex-row md:items-center md:gap-6 md:p-6"
    >
      {/* Col 1 — Identity */}
      <div className="flex items-start gap-4 md:w-[260px] md:shrink-0">
        <LogoOrInitials
          logoUrl={partner.logoUrl}
          initials={partner.logoPlaceholder}
          name={partner.name}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-text">
            {partner.name}
            {partner.verified && (
              <VerifiedBadge variant="inline" className="ml-1.5 align-middle" />
            )}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-text-2">
            <MapPin className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
            <span className="truncate">{partner.location}</span>
          </div>
        </div>
      </div>

      {/* Col 2 — Comparison facts */}
      <div className="flex flex-col gap-3 md:flex-1 md:border-l md:border-border-soft md:pl-6">
        <div className="flex items-center gap-1.5">
          <Star
            className="h-4 w-4 fill-amber text-amber"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="text-[15px] font-semibold text-navy">
            <span data-numeric>{partner.rating.toFixed(1)}</span>
          </span>
          <span className="text-[13px] text-text-3">
            (<span data-numeric>{partner.reviewCount}</span> reviews)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Response" value={responseTime} />
          <Stat label="Experience" value={years} />
          <Stat label="Min volume" value={minVolume} />
        </div>
      </div>

      {/* Col 3 — Services + CTA */}
      <div className="flex flex-col gap-3 md:w-[220px] md:shrink-0 md:items-end">
        <div className="flex flex-wrap gap-1.5 md:justify-end">
          {partner.services.slice(0, 3).map((service) => (
            <ServicePill key={service}>{service}</ServicePill>
          ))}
          {extraServices > 0 && (
            <ServicePill muted>+{extraServices}</ServicePill>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-blue transition-colors group-hover:text-blue-hover">
          View profile
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
