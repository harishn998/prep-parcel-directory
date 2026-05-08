"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { popularSearchChips } from "@/lib/sample-data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{ minHeight: 640 }}
      aria-label="Hero"
    >
      {/* Subtle radial wash behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(29,78,216,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[640px] max-w-[1280px] flex-col items-center justify-center px-6 py-20 text-center md:px-8 md:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-[860px] flex-col items-center"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text-2 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            The 3PL directory for serious eCommerce brands
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] text-text sm:text-[60px] md:text-[72px] lg:text-[80px]"
            style={{ fontWeight: 600 }}
          >
            Find your next
            <br />
            fulfillment partner.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-6 max-w-[640px] text-[17px] leading-[1.6] text-text-2 sm:text-[19px]"
          >
            Compare vetted 3PL warehouses, prep centers, and fulfillment
            partners. Real reviews from real eCommerce operators — no pay-to-play
            rankings.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-10 w-full max-w-[720px]"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-[13px] font-medium text-text-3">
              Popular:
            </span>
            {popularSearchChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="rounded-full border border-border-soft bg-surface px-3.5 py-1.5 text-[13px] font-medium text-text-2 transition-all duration-200 hover:border-blue hover:text-navy hover:shadow-sm"
              >
                {chip}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="group relative flex h-16 w-full items-center rounded-2xl border border-border-soft bg-surface shadow-sm transition-all duration-200 focus-within:border-blue focus-within:shadow-[0_0_0_4px_rgba(29,78,216,0.12)]"
    >
      <Search
        className="ml-5 h-5 w-5 shrink-0 text-text-3 transition-colors duration-200 group-focus-within:text-blue"
        strokeWidth={2}
      />
      <input
        type="search"
        placeholder="Search by service, location, or partner name"
        className="h-full flex-1 bg-transparent px-4 text-[15px] text-text placeholder:text-text-3 focus:outline-none sm:text-[16px]"
      />
      <button
        type="submit"
        className="mr-2 hidden h-12 items-center rounded-xl bg-blue px-5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-hover sm:inline-flex"
      >
        Search
      </button>
    </form>
  );
}
