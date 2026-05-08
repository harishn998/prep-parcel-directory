"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

type Options = {
  durationMs?: number;
  formatter?: (n: number) => string;
};

export function useCountUp(target: number, options: Options = {}) {
  const { durationMs = 1600, formatter } = options;
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motion = useMotionValue(0);
  const [display, setDisplay] = useState(() =>
    formatter ? formatter(0) : "0"
  );

  useMotionValueEvent(motion, "change", (latest) => {
    setDisplay(formatter ? formatter(latest) : Math.round(latest).toString());
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motion, target, {
      duration: durationMs / 1000,
      ease: [0.22, 0.61, 0.36, 1],
    });
    return controls.stop;
  }, [inView, target, durationMs, motion]);

  return { ref, display };
}
