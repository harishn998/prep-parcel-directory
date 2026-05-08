import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-navy" aria-label="List your 3PL">
      {/* Subtle blue glow */}
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
          <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-white/60">
            For 3PL operators
          </p>
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[44px]">
            List your 3PL on the largest verified directory.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.65] text-white/70">
            Get in front of qualified eCommerce brands looking for their next
            fulfillment partner. Free to list, paid plans for premium placement.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button className="h-12 bg-white px-6 text-[15px] font-medium text-navy transition-colors duration-200 hover:bg-white/90">
            List Your 3PL
            <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            className="h-12 px-4 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white"
          >
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  );
}
