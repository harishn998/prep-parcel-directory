"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only when `loading` has been true for `delayMs` continuously,
 * preventing skeleton flashes for fast operations. Goes false the moment
 * `loading` flips to false.
 */
export function useDebouncedLoading(loading: boolean, delayMs = 200) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(t);
  }, [loading, delayMs]);

  return show;
}
