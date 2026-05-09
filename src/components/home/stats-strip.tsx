"use client";

import { stats, type Stat } from "@/lib/static-data";
import { useCountUp } from "@/hooks/use-count-up";

export function StatsStrip() {
  return (
    <section className="bg-navy" aria-label="Stats">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  const { ref, display } = useCountUp(stat.value, {
    durationMs: 1800,
    formatter: (n) => Math.round(n).toLocaleString("en-US"),
  });

  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <span
        ref={ref}
        className="stat-num text-[44px] leading-none text-white md:text-[56px]"
      >
        {stat.prefix ?? ""}
        {display}
        {stat.suffix ?? ""}
      </span>
      <span className="mt-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white/60">
        {stat.label}
      </span>
    </div>
  );
}
