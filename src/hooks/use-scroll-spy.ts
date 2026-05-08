"use client";

import { useEffect, useState } from "react";

/**
 * Watches a list of section IDs and returns the one most prominently in view.
 * Uses a single IntersectionObserver with a top-mid biased rootMargin so the
 * "active" tab tracks the section the user is reading, not just the top edge.
 */
export function useScrollSpy(
  sectionIds: string[],
  options: { rootMargin?: string } = {}
) {
  const { rootMargin = "-30% 0px -55% 0px" } = options;
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size > 0) {
          let topId = "";
          let topRatio = -1;
          for (const [id, ratio] of visible) {
            if (ratio > topRatio) {
              topId = id;
              topRatio = ratio;
            }
          }
          if (topId) setActiveId(topId);
        }
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
