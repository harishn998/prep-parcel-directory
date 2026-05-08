import { Star } from "lucide-react";
import type { Partner } from "@/lib/sample-data";
import { StarRating } from "./star-rating";

export function RatingBreakdown({ partner }: { partner: Partner }) {
  const total = Object.values(partner.ratingBreakdown).reduce(
    (sum, n) => sum + n,
    0
  );
  const buckets: { stars: 1 | 2 | 3 | 4 | 5; count: number }[] = [
    { stars: 5, count: partner.ratingBreakdown[5] },
    { stars: 4, count: partner.ratingBreakdown[4] },
    { stars: 3, count: partner.ratingBreakdown[3] },
    { stars: 2, count: partner.ratingBreakdown[2] },
    { stars: 1, count: partner.ratingBreakdown[1] },
  ];

  return (
    <div className="grid grid-cols-1 items-center gap-8 rounded-2xl border border-border-soft bg-surface p-7 md:grid-cols-[auto_1fr]">
      <div className="text-center md:text-left">
        <p
          data-numeric
          className="text-[64px] font-medium leading-none tracking-[-0.02em] text-text"
        >
          {partner.rating.toFixed(1)}
        </p>
        <StarRating rating={partner.rating} size={18} className="mt-3" />
        <p className="mt-2 text-[13px] text-text-2">
          Based on{" "}
          <span data-numeric className="font-medium text-text">
            {partner.reviewCount}
          </span>{" "}
          verified reviews
        </p>
      </div>
      <div className="space-y-2">
        {buckets.map(({ stars, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={stars} className="flex items-center gap-3">
              <span className="flex w-8 items-center gap-1 text-[13px] text-text-2">
                {stars}
                <Star
                  className="h-3 w-3 fill-amber text-amber"
                  strokeWidth={1.5}
                />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-amber"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
              </div>
              <span
                data-numeric
                className="w-12 text-right text-[12px] text-text-3"
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
