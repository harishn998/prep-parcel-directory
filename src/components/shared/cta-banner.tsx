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

        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button className="h-12 w-full justify-center bg-white px-6 text-[15px] font-medium text-navy transition-colors duration-200 hover:bg-white/90 sm:w-auto">
            {primaryLabel}
            <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2} />
          </Button>
          {secondaryLabel && (
            <Button
              variant="ghost"
              className="h-12 w-full justify-center border border-white/40 bg-transparent px-6 text-[15px] font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10 hover:text-white sm:w-auto"
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
