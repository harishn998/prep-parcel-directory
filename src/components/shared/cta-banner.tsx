import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type CtaBannerProps = {
  eyebrow?: string;
  heading: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  ariaLabel?: string;
};

export function CtaBanner({
  eyebrow,
  heading,
  description,
  primaryLabel,
  secondaryLabel,
  ariaLabel,
}: CtaBannerProps) {
  return (
    <section
      className="relative overflow-hidden bg-navy"
      aria-label={ariaLabel ?? heading}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 0%, rgba(59,130,246,0.25) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-10 px-6 py-20 md:flex-row md:items-center md:justify-between md:px-8 md:py-24">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-white/60">
              {eyebrow}
            </p>
          )}
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[44px]">
            {heading}
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.65] text-white/70">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button className="h-12 bg-white px-6 text-[15px] font-medium text-navy transition-colors duration-200 hover:bg-white/90">
            {primaryLabel}
            <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2} />
          </Button>
          {secondaryLabel && (
            <Button
              variant="ghost"
              className="h-12 px-4 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
