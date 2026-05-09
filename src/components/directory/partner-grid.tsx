"use client";

import { motion } from "framer-motion";
import type { Partner } from "@/lib/data/types";
import { PartnerCard } from "@/components/home/partner-card";
import { PartnerCardSkeleton } from "./partner-card-skeleton";
import { EmptyState } from "./empty-state";

export function PartnerGrid({
  partners,
  loading,
  onClearFilters,
}: {
  partners: Partner[];
  loading: boolean;
  onClearFilters: () => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PartnerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (partners.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {partners.map((partner, idx) => (
        <motion.div
          key={partner.slug}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.28,
            delay: Math.min(idx * 0.03, 0.18),
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          <PartnerCard partner={partner} />
        </motion.div>
      ))}
    </div>
  );
}
