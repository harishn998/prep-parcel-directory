"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { popularSearchPills } from "@/lib/static-data";
import { HeroBg } from "./hero-bg";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{ minHeight: 640 }}
      aria-label="Hero"
    >
      {/* Gradient aurora — soft, slow-drifting indigo/coral/blue blobs. Sits
          beneath the logistics-network SVG for a layered, alive hero. */}
      <div aria-hidden className="hero-aurora">
        <span className="hero-aurora-blue" />
      </div>

      {/* Logistics-network background */}
      <HeroBg />

      {/* Static top-edge wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(29,78,216,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[640px] max-w-[1280px] flex-col items-center justify-center px-6 py-20 text-center md:px-8 md:py-28">
        <div className="flex w-full max-w-[860px] flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text-2 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            The 3PL directory for serious eCommerce brands
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] text-text sm:text-[60px] md:text-[72px] lg:text-[80px]"
            style={{ fontWeight: 600 }}
          >
            Find your next
            <br />
            fulfillment partner.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-[640px] text-[17px] leading-[1.6] text-text-2 sm:text-[19px]"
          >
            Compare vetted 3PL warehouses, prep centers, and fulfillment
            partners. Real reviews from real eCommerce operators — no pay-to-play
            rankings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            className="mt-10 w-full max-w-[720px]"
          >
            <SearchBar />
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              className="text-[13px] font-medium text-text-3"
            >
              Popular:
            </motion.span>
            {popularSearchPills.map((pill, idx) => (
              <motion.div
                key={pill.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + idx * 0.04,
                  ease: EASE,
                }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={`/directory?services=${encodeURIComponent(pill.slug)}`}
                  className="inline-flex rounded-full border border-border-soft bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text-2 transition-all duration-200 hover:border-indigo hover:text-navy hover:shadow-sm"
                >
                  {pill.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(
      trimmed ? `/directory?q=${encodeURIComponent(trimmed)}` : "/directory"
    );
  };
  return (
    <form
      onSubmit={onSubmit}
      className="group relative flex h-16 w-full items-center rounded-2xl border border-border-soft bg-surface shadow-sm transition-all duration-200 focus-within:border-indigo focus-within:shadow-[0_0_0_4px_rgba(99,91,255,0.15)]"
    >
      <Search
        className="ml-5 h-5 w-5 shrink-0 text-text-3 transition-colors duration-200 group-focus-within:text-indigo"
        strokeWidth={2}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by service, location, or partner name"
        className="h-full flex-1 bg-transparent px-4 text-[15px] text-text placeholder:text-text-3 focus:outline-none sm:text-[16px]"
      />
      <button
        type="submit"
        className="btn-primary-gradient mr-2 hidden h-12 items-center rounded-xl px-5 text-[14px] font-medium sm:inline-flex"
      >
        Search
      </button>
    </form>
  );
}
