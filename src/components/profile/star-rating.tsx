import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 16,
  showValue = false,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1 ${className ?? ""}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(rating);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              strokeWidth={1.5}
              className={
                filled
                  ? "fill-amber text-amber"
                  : "fill-secondary text-text-3"
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span data-numeric className="ml-1 text-[14px] font-medium text-text">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
