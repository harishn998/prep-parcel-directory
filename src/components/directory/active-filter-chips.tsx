"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Lock } from "lucide-react";

export type ActiveChip = {
  id: string;
  label: string;
  onRemove: () => void;
  locked?: boolean;
};

export function ActiveFilterChips({
  chips,
  onClearAll,
}: {
  chips: ActiveChip[];
  onClearAll?: () => void;
}) {
  if (chips.length === 0) return null;
  const removableCount = chips.filter((c) => !c.locked).length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) =>
          chip.locked ? (
            <motion.span
              key={chip.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-secondary px-3 py-1 text-[13px] font-medium text-navy"
            >
              <Lock className="h-3 w-3 text-text-3" strokeWidth={2} />
              {chip.label}
            </motion.span>
          ) : (
            <motion.span
              key={chip.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo/50 bg-indigo-soft py-1 pl-3 pr-1 text-[13px] font-medium text-indigo"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-indigo/70 transition-colors duration-200 hover:bg-indigo/15 hover:text-indigo"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </motion.span>
          )
        )}
      </AnimatePresence>
      {onClearAll && removableCount > 1 && (
        <motion.button
          layout
          type="button"
          onClick={onClearAll}
          className="ml-1 text-[13px] font-medium text-text-2 underline-offset-4 transition-colors duration-200 hover:text-navy hover:underline"
        >
          Clear all
        </motion.button>
      )}
    </div>
  );
}
