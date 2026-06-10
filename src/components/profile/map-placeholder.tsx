import { MapPin } from "lucide-react";

// Deliberate "coming soon" placeholder — reads as a designed surface, not
// unfinished work. Warm cream-tint card with a faint indigo dot grid behind.
export function MapPlaceholder() {
  return (
    <div className="shadow-card-static bg-surface-tint relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-soft">
      <div
        aria-hidden
        className="bg-dot-pattern-indigo pointer-events-none absolute inset-0"
      />
      <div className="relative flex max-w-[320px] flex-col items-center gap-4 px-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-soft">
          <MapPin className="h-6 w-6 text-navy" strokeWidth={2} />
        </span>
        <div className="space-y-1.5">
          <h3 className="font-heading text-[16px] font-semibold text-navy">
            Interactive map coming soon
          </h3>
          <p className="text-[14px] leading-[1.5] text-text-2">
            We&rsquo;re building a fast, comparison-friendly map view for partner
            locations.
          </p>
        </div>
      </div>
    </div>
  );
}
