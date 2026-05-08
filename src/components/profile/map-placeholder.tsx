import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div
      className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-soft"
      style={{
        background:
          "linear-gradient(135deg, #0c1e3e 0%, #1d4ed8 60%, #3b82f6 100%)",
      }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0%, transparent 35%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <MapPin className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="text-[14px] font-medium uppercase tracking-[0.08em] text-white/80">
          Map coming soon
        </span>
      </div>
    </div>
  );
}
