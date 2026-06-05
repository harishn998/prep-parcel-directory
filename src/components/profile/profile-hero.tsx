"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowUpRight,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { coverGradientCss } from "@/lib/static-data";
import { LogoOrInitials } from "@/components/directory/logo-or-initials";
import { VerifiedBadge } from "@/components/directory/verified-badge";
import type { Partner } from "@/lib/data/types";

const COUNTRY_SLUG_MAP = {
  USA: "usa",
  Canada: "canada",
  UK: "uk",
} as const;

export function ProfileHero({ partner }: { partner: Partner }) {
  return (
    <section className="relative" aria-label="Profile header">
      {/* Breadcrumb — sits above the cover in normal page flow */}
      <div className="mx-auto max-w-[1280px] px-6 pt-8 pb-4 md:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Directory", href: "/directory" },
            { label: partner.name },
          ]}
        />
      </div>

      {/* Cover */}
      <div className="relative h-40 w-full overflow-hidden md:h-60" aria-hidden>
        {partner.coverImageUrl ? (
          <Image
            src={partner.coverImageUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: coverGradientCss(partner.coverGradient) }}
          />
        )}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Header card — overlaps cover on desktop only; stacks below on mobile */}
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="shadow-card-static relative z-10 mt-6 md:!-mt-20 rounded-2xl border border-border-soft bg-surface p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <LogoOrInitials
              logoUrl={partner.logoUrl}
              initials={partner.logoPlaceholder}
              name={partner.name}
              size="lg"
            />

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-text md:text-[36px]">
                  {partner.name}
                </h1>
                {partner.verified && <VerifiedBadge size="md" />}
              </div>

              <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-text-2 md:text-[17px]">
                {partner.tagline}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-text-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
                  {partner.city ? (
                    <Link
                      href={`/location/${COUNTRY_SLUG_MAP[partner.country]}/${partner.state}/${partner.city}`}
                      className="transition-colors duration-200 hover:text-blue hover:underline underline-offset-4"
                    >
                      {partner.location}
                    </Link>
                  ) : (
                    <Link
                      href={`/location/${COUNTRY_SLUG_MAP[partner.country]}/${partner.state}`}
                      className="transition-colors duration-200 hover:text-blue hover:underline underline-offset-4"
                    >
                      {partner.location}
                    </Link>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar
                    className="h-3.5 w-3.5 text-text-3"
                    strokeWidth={2}
                  />
                  Founded{" "}
                  <span data-numeric className="font-medium text-text">
                    {partner.yearFounded}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
                  {partner.employeeCount} employees
                </span>
                <span className="flex items-center gap-1.5">
                  <Star
                    className="h-3.5 w-3.5 fill-amber text-amber"
                    strokeWidth={1.5}
                  />
                  <span data-numeric className="font-medium text-text">
                    {partner.rating.toFixed(1)}
                  </span>
                  <span className="text-text-3">
                    (<span data-numeric>{partner.reviewCount}</span> reviews)
                  </span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <Button className="h-[52px] bg-blue px-6 text-[15px] font-medium text-white hover:bg-blue-hover">
                  Get Quote
                </Button>
                <Button
                  variant="outline"
                  className="h-[52px] border-border-soft px-5 text-[15px] font-medium text-navy hover:border-blue hover:text-blue"
                >
                  Visit Website
                  <ArrowUpRight
                    className="ml-1 h-4 w-4"
                    strokeWidth={2}
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <IconButton label="Save">
                  <Heart className="h-4 w-4" strokeWidth={2} />
                </IconButton>
                <IconButton label="Share">
                  <Share2 className="h-4 w-4" strokeWidth={2} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft bg-surface text-text-2 transition-all duration-200 hover:border-blue hover:text-blue"
    >
      {children}
    </button>
  );
}
