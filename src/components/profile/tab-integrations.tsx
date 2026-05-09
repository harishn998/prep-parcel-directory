"use client";

import { motion } from "framer-motion";
import { Plug } from "lucide-react";
import type { Partner } from "@/lib/data/types";

export function TabIntegrations({ partner }: { partner: Partner }) {
  return (
    <motion.section
      id="integrations"
      className="scroll-mt-[152px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text">
        Integrations
      </h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-text-2">
        {partner.name} connects directly to the storefronts, ERPs, and ops
        platforms eCommerce brands actually use.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {partner.integrations.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface p-4 transition-colors duration-200 hover:border-blue"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-navy">
              <Plug className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-[14px] font-medium tracking-[-0.01em] text-text">
              {name}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-text">
        Certifications
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {partner.certifications.map((c) => (
          <span
            key={c}
            className="rounded-full border border-success/30 bg-success/5 px-3 py-1 text-[13px] font-medium text-success"
          >
            {c}
          </span>
        ))}
      </div>
    </motion.section>
  );
}
