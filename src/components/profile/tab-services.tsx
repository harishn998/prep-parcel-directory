"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Partner } from "@/lib/data/types";

export function TabServices({ partner }: { partner: Partner }) {
  return (
    <motion.section
      id="services"
      className="scroll-mt-[152px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text">
        Services
      </h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-text-2">
        Included services come standard with every plan. Add-ons are available
        with custom pricing.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {partner.detailedServices.map((service) => (
          <div
            key={service.name}
            className="flex flex-col rounded-xl border border-border-soft bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-text">
                {service.name}
              </h3>
              {service.included ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[12px] font-medium text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  Included
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center rounded-full border border-border-soft bg-secondary px-2 py-0.5 text-[12px] font-medium text-text-2">
                  Add-on
                </span>
              )}
            </div>
            <p className="mt-3 text-[14px] leading-[1.6] text-text-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
