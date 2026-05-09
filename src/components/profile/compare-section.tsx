"use client";

import { useState } from "react";
import { Check, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Partner } from "@/lib/data/types";

export function CompareSection({
  current,
  similar,
}: {
  current: Partner;
  similar: Partner[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set([current.slug])
  );

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const all = [current, ...similar];

  return (
    <section className="bg-background section">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <header className="mb-8">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-blue">
            Compare partners
          </p>
          <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-text md:text-[32px]">
            Compare {current.name} with similar partners.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {all.map((p) => {
            const isSelected = selected.has(p.slug);
            const isCurrent = p.slug === current.slug;
            return (
              <button
                type="button"
                key={p.slug}
                onClick={() => !isCurrent && toggle(p.slug)}
                aria-pressed={isSelected}
                disabled={isCurrent}
                className={[
                  "group flex flex-col items-start gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                  isSelected
                    ? "border-blue bg-blue/[0.04]"
                    : "border-border-soft bg-surface hover:border-blue/60",
                  isCurrent ? "opacity-90" : "cursor-pointer",
                ].join(" ")}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-soft bg-secondary text-[13px] font-semibold text-navy"
                    aria-hidden
                  >
                    {p.logoPlaceholder}
                  </span>
                  <span
                    className={[
                      "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-200",
                      isSelected
                        ? "border-blue bg-blue text-white"
                        : "border-border-soft bg-surface text-transparent",
                    ].join(" ")}
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-text">
                    {p.name}
                    {isCurrent && (
                      <span className="ml-1.5 text-[11px] font-medium text-text-3">
                        (current)
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[12px] text-text-2">{p.location}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button className="h-11 bg-blue px-6 text-[14px] font-medium text-white hover:bg-blue-hover">
            <GitCompare className="mr-1.5 h-4 w-4" strokeWidth={2} />
            Compare {selected.size} partner{selected.size === 1 ? "" : "s"}
          </Button>
          <p className="text-[13px] text-text-3">
            Visual demo — comparison view coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
