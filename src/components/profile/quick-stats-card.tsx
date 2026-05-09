import type { Partner } from "@/lib/data/types";

const volumeLabels: Record<string, string> = {
  none: "No minimum",
  "100": "100+ orders/mo",
  "500": "500+ orders/mo",
  "1000": "1,000+ orders/mo",
};

export function QuickStatsCard({ partner }: { partner: Partner }) {
  const rows: { label: string; value: string }[] = [
    { label: "Min order", value: volumeLabels[partner.minimumOrderVolume] },
    { label: "Pricing model", value: partner.pricingModel },
    { label: "Response time", value: partner.responseTime },
    { label: "Fulfillment speed", value: partner.fulfillmentSpeed },
  ];
  return (
    <section className="rounded-2xl border border-border-soft bg-surface p-6">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">
        Quick stats
      </h3>
      <dl className="mt-4 space-y-3.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-border-soft pb-3.5 last:border-b-0 last:pb-0"
          >
            <dt className="shrink-0 text-[13px] text-text-2">{row.label}</dt>
            <dd className="text-right text-[13px] font-medium text-text">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
