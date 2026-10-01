import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind class names safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Indian Rupees (₹).
 * e.g. 61999 → "₹61,999"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as a given currency string.
 * Falls back to USD if not provided.
 */
export function formatCurrency(
  amount: number,
  currency: "INR" | "USD" = "INR"
): string {
  if (currency === "INR") return formatINR(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats a compact date string */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

/** Calculates % change between two values */
export function calcPercentChange(from: number, to: number): number {
  if (from === 0) return 0;
  return Math.round(((to - from) / from) * 100);
}

/** Returns depreciation percentage from launch to current */
export function calcDepreciation(launchPrice: number, currentPrice: number): number {
  return Math.abs(calcPercentChange(launchPrice, currentPrice));
}
