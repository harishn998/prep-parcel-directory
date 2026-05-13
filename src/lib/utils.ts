import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/**
 * Format a Date or ISO string as a short relative time ("2 hours ago",
 * "just now"). Falls back to "just now" for very recent values.
 */
export function relativeTime(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const absSec = Math.abs(diffSec);
  if (absSec < 30) return "just now";
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, threshold] of RELATIVE_UNITS) {
    if (absSec >= threshold) {
      const value = Math.round(diffSec / threshold);
      return formatter.format(value, unit);
    }
  }
  return formatter.format(diffSec, "second");
}
