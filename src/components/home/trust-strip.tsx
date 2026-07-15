import Image from "next/image";

// Real customer logos in public/logos/trusted-by/. Each logo sits in a
// fixed-size box and is fit with object-contain (via next/image `fill`), so the
// six containers occupy equal horizontal space regardless of the logo's aspect
// ratio — different-aspect marks then read as visually balanced.
const partnerLogos = [
  { name: "ANS Performance", file: "ans.webp" },
  { name: "Eight Sleep", file: "eight-sleep.webp" },
  { name: "Emma", file: "emma.webp" },
  { name: "Four Three Seven", file: "four-three-seven.webp" },
  { name: "GNC", file: "gnc.webp" },
  { name: "Nurse Yard", file: "nurse-yard.webp" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border-soft bg-surface" aria-label="Customers">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 py-10 md:px-8 md:py-12 lg:flex-row lg:gap-12">
        <p className="shrink-0 text-[13px] font-medium uppercase tracking-[0.08em] text-text-3">
          Trusted by leading eCommerce brands
        </p>
        <div className="grid w-full grid-cols-3 place-items-center gap-x-8 gap-y-6 md:grid-cols-6">
          {partnerLogos.map((logo) => (
            <div
              key={logo.name}
              className="relative h-10 w-24 max-w-full md:h-12 md:w-32"
            >
              <Image
                src={`/logos/trusted-by/${logo.file}`}
                alt={logo.name}
                fill
                sizes="(max-width: 768px) 96px, 128px"
                className="object-contain opacity-[0.55] grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
