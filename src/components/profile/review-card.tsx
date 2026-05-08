import { ThumbsUp, BadgeCheck } from "lucide-react";
import type { Review } from "@/lib/sample-data";
import { StarRating } from "./star-rating";

const palette = [
  "bg-blue/10 text-blue",
  "bg-amber/15 text-amber",
  "bg-success/10 text-success",
  "bg-navy/10 text-navy",
];

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewCard({
  review,
  paletteIndex = 0,
}: {
  review: Review;
  paletteIndex?: number;
}) {
  const swatch = palette[paletteIndex % palette.length];
  return (
    <article className="flex gap-4 rounded-xl border border-border-soft bg-surface p-6">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${swatch}`}
        aria-hidden
      >
        {initialsOf(review.reviewerName)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-text">
            {review.reviewerName}
          </span>
          <span className="text-[13px] text-text-3">·</span>
          <span className="text-[13px] text-text-2">
            {review.reviewerCompany}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <StarRating rating={review.rating} size={14} />
          <span className="text-[12px] text-text-3">
            {formatDate(review.date)}
          </span>
          {review.verified && (
            <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[11px] font-medium text-success">
              <BadgeCheck className="h-3 w-3" strokeWidth={2.5} />
              Verified
            </span>
          )}
        </div>

        <p className="mt-3 text-[15px] leading-[1.65] text-text-2">
          {review.text}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-3 transition-colors duration-200 hover:text-text-2"
          >
            <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
            Helpful (<span data-numeric>{review.helpful}</span>)
          </button>
        </div>
      </div>
    </article>
  );
}
