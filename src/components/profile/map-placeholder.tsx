import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div
      className="shadow-card-static bg-dot-pattern relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-soft bg-slate-50"
      aria-hidden
    >
      <div className="relative flex flex-col items-center gap-3">
        <span className="shadow-card-static flex h-14 w-14 items-center justify-center rounded-full bg-white">
          <MapPin className="h-6 w-6 text-navy" strokeWidth={2} />
        </span>
        <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-3">
          Map coming soon
        </span>
      </div>
    </div>
  );
}
