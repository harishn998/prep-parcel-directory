import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Partner } from "@/lib/data/types";
import { LogoOrInitials } from "@/components/directory/logo-or-initials";
import { ServicePill } from "@/components/directory/service-pill";
import { VerifiedBadge } from "@/components/directory/verified-badge";
import { FeaturedPill } from "@/components/directory/featured-pill";

export function PartnerCard({ partner }: { partner: Partner }) {
  const extraServices = Math.max(partner.services.length - 3, 0);

  return (
    <Link
      href={`/directory/${partner.slug}`}
      className={`shadow-card group relative flex h-full cursor-pointer flex-col rounded-2xl border border-border-soft bg-surface p-6${
        partner.featured ? " border-t-2 border-t-indigo" : ""
      }`}
    >
      {/* Featured pill on its own line, top-right — kept OUT of the name row so
          it never competes with the name for horizontal width. The indigo
          top border is the primary "featured" signal; this reinforces it. */}
      {partner.featured && <FeaturedPill className="mb-3 ml-auto" />}
      <div className="flex items-start gap-4">
        <LogoOrInitials
          logoUrl={partner.logoUrl}
          initials={partner.logoPlaceholder}
          name={partner.name}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-text">
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

      <div className="mt-4 flex items-center gap-1.5">
        <Star
          className="star-amber h-4 w-4 fill-amber text-amber"
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

      <p className="mt-3 line-clamp-2 text-[14px] leading-[1.55] text-text-2">
        {partner.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {partner.services.slice(0, 3).map((service) => (
          <ServicePill key={service}>{service}</ServicePill>
        ))}
        {extraServices > 0 && (
          <ServicePill muted>+{extraServices} more</ServicePill>
        )}
      </div>
    </Link>
  );
}
