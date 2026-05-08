const partnerLogos = [
  "Acme Outdoor",
  "Lumen & Co.",
  "Northern Roast",
  "Bluepine Apparel",
  "Origin Pet",
  "Halcyon Beauty",
];

export function TrustStrip() {
  return (
    <section className="border-y border-border-soft bg-surface" aria-label="Customers">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 py-10 md:px-8 md:py-12 lg:flex-row lg:gap-12">
        <p className="shrink-0 text-[13px] font-medium uppercase tracking-[0.08em] text-text-3">
          Trusted by 500+ eCommerce brands
        </p>
        <div className="grid w-full grid-cols-3 items-center gap-x-8 gap-y-6 md:grid-cols-6">
          {partnerLogos.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center text-[15px] font-semibold tracking-tight text-text-3 grayscale transition-colors duration-200 hover:text-text-2"
              style={{ letterSpacing: "-0.01em" }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
