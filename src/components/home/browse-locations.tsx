import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { US, CA, GB } from "country-flag-icons/react/3x2";
import { locations } from "@/lib/static-data";

// `location.flag` stores an ISO country code ("US" | "CA" | "GB").
const flagComponents: Record<string, typeof US> = { US, CA, GB };

export function BrowseLocations() {
  return (
    <section
      id="locations"
      className="section bg-surface"
      aria-labelledby="browse-locations-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <header className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-blue">
              Browse by location
            </p>
            <h2
              id="browse-locations-heading"
              className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-text md:text-[44px]"
            >
              Partners where your
              <br className="hidden sm:inline" /> customers ship.
            </h2>
          </div>
          <p className="max-w-md text-[16px] leading-[1.65] text-text-2">
            North America and the UK, with partners across 50+ cities.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {locations.map((location) => {
            const Flag = flagComponents[location.flag];
            return (
            <Link
              key={location.slug}
              href={`/location/${location.slug}`}
              className="lift-card group relative flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-background p-8"
            >
              {/* Real country flag — 3:2 container so the flag fills edge to edge */}
              <div className="mb-8 h-11 w-16 overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
                {Flag ? (
                  <Flag className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy text-[18px] font-semibold tracking-[-0.02em] text-white">
                    {location.flag}
                  </div>
                )}
              </div>

              <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-text">
                {location.country}
              </h3>

              <div className="mt-3 flex items-baseline gap-4 text-[14px] text-text-2">
                <span>
                  <span data-numeric className="text-text">
                    {location.partnerCount}
                  </span>{" "}
                  partners
                </span>
                <span className="h-1 w-1 rounded-full bg-text-3" />
                <span>
                  <span data-numeric className="text-text">
                    {location.cities}
                  </span>{" "}
                  cities
                </span>
              </div>

              <span className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-blue transition-colors duration-200 group-hover:text-navy">
                Explore
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </span>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
