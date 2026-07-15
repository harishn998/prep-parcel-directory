import Image from "next/image";

// Per-logo max-height tuning: the six marks have very different intrinsic
// visual weight (dense bold logos vs. thin extended wordmarks), so equal-width
// boxes alone didn't balance them. Each logo gets its own capped height so they
// read at roughly equal visual volume. Four Three Seven is a ~9:1 wordmark, so
// it's kept much shorter to keep its rendered width sensible.
const TRUSTED_BY_LOGOS = [
  { src: "/logos/trusted-by/emma.webp", alt: "Emma", maxHeightDesktop: 40, maxHeightMobile: 32 },
  { src: "/logos/trusted-by/ans.webp", alt: "ANS Performance", maxHeightDesktop: 32, maxHeightMobile: 26 },
  { src: "/logos/trusted-by/gnc.webp", alt: "GNC Live Well", maxHeightDesktop: 34, maxHeightMobile: 28 },
  { src: "/logos/trusted-by/eight-sleep.webp", alt: "Eight Sleep", maxHeightDesktop: 32, maxHeightMobile: 26 },
  { src: "/logos/trusted-by/four-three-seven.webp", alt: "Four Three Seven", maxHeightDesktop: 20, maxHeightMobile: 16 },
  { src: "/logos/trusted-by/nurse-yard.webp", alt: "Nurse Yard", maxHeightDesktop: 36, maxHeightMobile: 30 },
] as const;

const LOGO_CLASS =
  "w-auto object-contain opacity-[0.55] grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0";

export function TrustStrip() {
  return (
    <section className="border-y border-border-soft bg-surface" aria-label="Customers">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 py-10 md:px-8 md:py-12 lg:flex-row lg:gap-12">
        <p className="shrink-0 text-[13px] font-medium uppercase tracking-[0.08em] text-text-3">
          Trusted by leading eCommerce brands
        </p>
        <div className="grid w-full grid-cols-2 place-items-center gap-x-4 gap-y-4 md:grid-cols-6 md:gap-x-8 md:gap-y-0">
          {TRUSTED_BY_LOGOS.map((logo) => (
            <div key={logo.alt} className="flex h-14 items-center justify-center md:h-16">
              {/* Mobile: shorter tuned height */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={logo.maxHeightMobile}
                sizes="150px"
                className={`${LOGO_CLASS} block md:hidden`}
                style={{ height: "auto", maxHeight: `${logo.maxHeightMobile}px` }}
              />
              {/* Desktop: taller tuned height */}
              <Image
                src={logo.src}
                alt=""
                aria-hidden
                width={200}
                height={logo.maxHeightDesktop}
                sizes="200px"
                className={`${LOGO_CLASS} hidden md:block`}
                style={{ height: "auto", maxHeight: `${logo.maxHeightDesktop}px` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
