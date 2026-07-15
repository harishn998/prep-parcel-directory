import Image from "next/image";

// Real customer logos in public/logos/trusted-by/. Intrinsic width/height are
// passed to next/image to reserve layout space (no CLS); rendered height is
// capped via CSS (h-5 mobile / md:h-7 desktop) with w-auto to preserve ratio.
const partnerLogos = [
  { name: "ANS Performance", file: "ans.webp", width: 1600, height: 461 },
  { name: "Eight Sleep", file: "eight-sleep.webp", width: 700, height: 337 },
  { name: "Emma", file: "emma.webp", width: 432, height: 100 },
  { name: "Four Three Seven", file: "four-three-seven.webp", width: 1600, height: 194 },
  { name: "GNC", file: "gnc.webp", width: 1600, height: 461 },
  { name: "Nurse Yard", file: "nurse-yard.webp", width: 225, height: 50 },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border-soft bg-surface" aria-label="Customers">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 py-10 md:px-8 md:py-12 lg:flex-row lg:gap-12">
        <p className="shrink-0 text-[13px] font-medium uppercase tracking-[0.08em] text-text-3">
          Trusted by leading eCommerce brands
        </p>
        <div className="grid w-full grid-cols-3 items-center gap-x-8 gap-y-6 md:grid-cols-6">
          {partnerLogos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center">
              <Image
                src={`/logos/trusted-by/${logo.file}`}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className="h-5 w-auto max-w-full object-contain opacity-[0.55] grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 md:h-7"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
