import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { partners } from "@/lib/sample-data";
import { PartnerCard } from "./partner-card";

export function FeaturedPartners() {
  return (
    <section
      className="section bg-background"
      aria-labelledby="featured-partners-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <header className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <div className="max-w-2xl">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-blue">
              Featured Partners
            </p>
            <h2
              id="featured-partners-heading"
              className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-text md:text-[44px]"
            >
              Hand-picked, vetted, ready
              <br className="hidden sm:inline" /> to onboard.
            </h2>
          </div>
          <Link
            href="/directory"
            className="hidden shrink-0 items-center gap-1.5 text-[14px] font-medium text-blue transition-colors duration-200 hover:text-navy md:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {partners.slice(0, 6).map((partner) => (
            <PartnerCard key={partner.slug} partner={partner} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-blue"
          >
            View all
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
