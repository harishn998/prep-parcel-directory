"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

interface RouteTransitionProps {
  children: React.ReactNode;
}

/**
 * Client-side route transition: a subtle fade+slide keyed on the URL pathname.
 *
 * This app renders chrome (Navbar/Footer) per-page, so there is no shared
 * layout seam to isolate page content — the transition intentionally wraps the
 * whole page as a crossfade. The motion.div therefore carries `flex flex-1
 * flex-col` to preserve the body's sticky-footer flex column.
 *
 * CWV-safe: `initial={false}` means the FIRST paint does not animate (no LCP
 * hit); only subsequent navigations transition. Bypassed entirely under
 * prefers-reduced-motion.
 */
export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="flex flex-1 flex-col"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
