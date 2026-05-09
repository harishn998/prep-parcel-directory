"use client";

import { motion } from "framer-motion";
import { PackageCheck, Boxes, Truck } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import type { Partner } from "@/lib/data/types";

const offers = [
  {
    icon: PackageCheck,
    title: "Pick & Pack",
    body: "Same-day shipping cutoffs with documented per-SKU instructions and quality-controlled packouts.",
  },
  {
    icon: Boxes,
    title: "Inventory",
    body: "Real-time inventory sync to your storefront and 3PL dashboard, refreshed every 15 minutes.",
  },
  {
    icon: Truck,
    title: "Shipping",
    body: "Carrier-rate-shopped labels with national 2-day ground reach and white-glove options where available.",
  },
];

export function TabOverview({ partner }: { partner: Partner }) {
  return (
    <motion.section
      id="overview"
      className="scroll-mt-[152px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text">
        About {partner.name}
      </h2>
      <div className="mt-5 space-y-5 text-[16px] leading-[1.65] text-text-2">
        {partner.about.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <h3 className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-text">
        What they offer
      </h3>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {offers.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-xl border border-border-soft bg-surface p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-navy">
              <Icon className="h-4.5 w-4.5" strokeWidth={2} />
            </div>
            <p className="text-[16px] font-semibold tracking-[-0.01em] text-text">
              {title}
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-text-2">{body}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-text">
        Specialties
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {partner.specialties.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border-soft bg-surface px-3 py-1 text-[13px] font-medium text-text-2"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border-soft bg-surface px-6 py-7">
        <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
          <Stat
            value={partner.orderAccuracy}
            suffix="%"
            decimals={1}
            label="Order accuracy"
          />
          <Stat
            value={Number(partner.responseTime.match(/\d+/)?.[0] ?? 0)}
            suffix=" hr"
            label="Avg response time"
            valueOverride={partner.responseTime}
          />
          <Stat
            value={partner.yearsInBusiness}
            label="Years in business"
          />
          <Stat
            value={partner.activeBrandsServed}
            label="Active brands served"
          />
        </div>
      </div>
    </motion.section>
  );
}

function Stat({
  value,
  suffix,
  decimals = 0,
  label,
  valueOverride,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  valueOverride?: string;
}) {
  const { ref, display } = useCountUp(value, {
    durationMs: 1500,
    formatter: (n) =>
      decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US"),
  });
  return (
    <div className="flex flex-col items-start">
      <span
        ref={ref}
        className="stat-num text-[32px] leading-none text-text"
      >
        {valueOverride ?? `${display}${suffix ?? ""}`}
      </span>
      <span className="mt-2 text-[12px] font-medium uppercase tracking-[0.08em] text-text-3">
        {label}
      </span>
    </div>
  );
}
