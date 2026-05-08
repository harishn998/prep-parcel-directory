"use client";

import { useCallback } from "react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "integrations", label: "Integrations" },
  { id: "reviews", label: "Reviews" },
  { id: "locations", label: "Locations" },
];

const STICKY_OFFSET = 152; // 72 navbar + 64 tab bar + 16 breathing room

export function ProfileTabs() {
  const ids = tabs.map((t) => t.id);
  const active = useScrollSpy(ids);

  const onClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <nav
      aria-label="Profile sections"
      className="sticky top-[72px] z-30 border-b border-border-soft bg-surface/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div
          className="-mx-6 flex h-16 items-center gap-1 overflow-x-auto px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onClick(tab.id)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "relative h-16 shrink-0 px-4 text-[14px] font-medium transition-colors duration-200",
                  isActive ? "text-navy" : "text-text-2 hover:text-text",
                ].join(" ")}
              >
                {tab.label}
                <span
                  aria-hidden
                  className={[
                    "absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-all duration-200",
                    isActive ? "bg-blue" : "bg-transparent",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
