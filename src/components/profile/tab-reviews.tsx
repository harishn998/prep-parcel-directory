"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Partner } from "@/lib/data/types";
import { RatingBreakdown } from "./rating-breakdown";
import { ReviewCard } from "./review-card";

const filterOptions = [
  { value: "all", label: "All reviews" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
  { value: "verified", label: "Verified only" },
] as const;

const PAGE_SIZE = 6;

export function TabReviews({ partner }: { partner: Partner }) {
  const [filter, setFilter] = useState<(typeof filterOptions)[number]["value"]>(
    "all"
  );
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (filter === "all") return partner.reviews;
    if (filter === "verified") return partner.reviews.filter((r) => r.verified);
    const stars = Number(filter);
    return partner.reviews.filter((r) => r.rating === stars);
  }, [filter, partner.reviews]);

  const remaining = Math.max(filtered.length - visible, 0);

  return (
    <motion.section
      id="reviews"
      className="scroll-mt-[152px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text">
        Reviews
      </h2>

      <div className="mt-6">
        <RatingBreakdown partner={partner} />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-text">
          What brands are saying
        </h3>
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v as (typeof filterOptions)[number]["value"]);
            setVisible(PAGE_SIZE);
          }}
        >
          <SelectTrigger className="h-10 w-[180px] border-border-soft bg-surface text-[14px] font-medium text-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.slice(0, visible).map((review, i) => (
          <ReviewCard key={i} review={review} paletteIndex={i} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-border-soft bg-surface px-6 py-10 text-center text-[14px] text-text-2">
            No reviews match this filter.
          </p>
        )}
      </div>

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="h-11 border-border-soft px-6 text-[14px] font-medium text-navy hover:border-blue hover:text-blue"
          >
            Load more reviews
            <span data-numeric className="ml-2 text-text-3">
              ({remaining})
            </span>
            <ChevronDown className="ml-1 h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      )}
    </motion.section>
  );
}
