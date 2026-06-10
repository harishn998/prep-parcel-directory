"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { Partner } from "@/lib/data/types";
import { PartnerCard } from "@/components/home/partner-card";
import { PartnerRow } from "./partner-row";
import { PartnerCardSkeleton } from "./partner-card-skeleton";
import { EmptyState } from "./empty-state";

type View = "rows" | "grid";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i, 7) * 0.04,
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function PartnerGrid({
  partners,
  loading,
  onClearFilters,
  view = "grid",
}: {
  partners: Partner[];
  loading: boolean;
  onClearFilters: () => void;
  view?: View;
}) {
  const reduceMotion = useReducedMotion();

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

  const containerClass =
    view === "grid"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      : "flex flex-col gap-4";

  if (reduceMotion) {
    return (
      <div className={containerClass}>
        {partners.map((partner) => (
          <div key={partner.slug}>
            {view === "grid" ? (
              <PartnerCard partner={partner} />
            ) : (
              <PartnerRow partner={partner} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className={containerClass}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.slug}
              custom={idx}
              variants={itemVariants}
              layout
              whileHover={{ y: -6 }}
              transition={{ layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            >
              {view === "grid" ? (
                <PartnerCard partner={partner} />
              ) : (
                <PartnerRow partner={partner} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
