"use client";

import { motion } from "framer-motion";
import { Building2, Clock } from "lucide-react";
import type { Partner } from "@/lib/sample-data";
import { MapPlaceholder } from "./map-placeholder";

export function TabLocations({ partner }: { partner: Partner }) {
  return (
    <motion.section
      id="locations"
      className="scroll-mt-[152px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text">
        Locations
      </h2>
      <p className="mt-3 max-w-2xl text-[16px] leading-[1.65] text-text-2">
        {partner.warehouses.length} active facilit
        {partner.warehouses.length === 1 ? "y" : "ies"} totaling{" "}
        <span data-numeric className="font-medium text-text">
          {partner.warehouses
            .reduce((sum, w) => sum + w.sqft, 0)
            .toLocaleString("en-US")}
        </span>{" "}
        sqft.
      </p>

      <div className="mt-6">
        <MapPlaceholder />
      </div>

      <div className="mt-8 space-y-4">
        {partner.warehouses.map((w) => (
          <div
            key={w.address}
            className="flex flex-col gap-5 rounded-xl border border-border-soft bg-surface p-6 md:flex-row md:items-start md:gap-8"
          >
            <div className="flex shrink-0 items-start gap-3 md:w-64">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-navy">
                <Building2 className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[16px] font-semibold tracking-[-0.01em] text-text">
                  {w.city}
                </p>
                <p className="mt-1 text-[13px] text-text-2">{w.address}</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-3">
                  Square footage
                </p>
                <p
                  data-numeric
                  className="mt-1 text-[18px] font-medium text-text"
                >
                  {w.sqft.toLocaleString("en-US")}
                </p>
              </div>
              <div className="md:max-w-xs">
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-3">
                  Hours
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-text-2">
                  <Clock className="h-3.5 w-3.5 text-text-3" strokeWidth={2} />
                  {w.hours}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-3">
                  Services
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {w.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border-soft bg-background px-2 py-0.5 text-[12px] font-medium text-text-2"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
