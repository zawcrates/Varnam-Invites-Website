/**
 * formatters.ts
 *
 * Pure formatting functions.
 *
 * Rules:
 *   - Every function is pure: same input → same output, no side effects.
 *   - No React imports. These are plain TypeScript utilities.
 *   - No calls to external APIs or localStorage.
 *
 * Usage:
 *   import { formatPrice, formatDate } from "@/utils";
 */

import { CURRENCY_SYMBOL } from "./constants";

// ---------------------------------------------------------------------------
// Price / Currency
// ---------------------------------------------------------------------------

/**
 * Formats a price in INR for display.
 *
 * @example
 *   formatPrice(999)   → "₹999"
 *   formatPrice(1999)  → "₹1,999"
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("en-IN")}`;
}

/**
 * Calculates the discount amount between original and sale price.
 *
 * @example
 *   formatDiscount(1999, 999)  → "₹1,000"
 */
export function formatDiscount(originalPrice: number, salePrice: number): string {
  return formatPrice(originalPrice - salePrice);
}

/**
 * Calculates the discount percentage rounded to the nearest integer.
 *
 * @example
 *   formatDiscountPercent(1999, 999)  → "50% OFF"
 */
export function formatDiscountPercent(originalPrice: number, salePrice: number): string {
  const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  return `${pct}% OFF`;
}

// ---------------------------------------------------------------------------
// Phone
// ---------------------------------------------------------------------------

/**
 * Formats a phone number for display by concatenating country code and number.
 *
 * @example
 *   formatPhone("+91", "9876543210")  → "+91 9876543210"
 */
export function formatPhone(countryCode: string, number: string): string {
  return `${countryCode}${number.trim()}`;
}

// ---------------------------------------------------------------------------
// Date / Time
// ---------------------------------------------------------------------------

/**
 * Formats an ISO 8601 date string for display.
 *
 * @example
 *   formatDate("2025-11-23T07:45:00Z")  → "23 Nov 2025"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns a relative time string like "2 days ago" or "just now".
 *
 * @example
 *   formatRelativeTime("2025-11-21T00:00:00Z")  → "2 days ago"
 */
export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ---------------------------------------------------------------------------
// String
// ---------------------------------------------------------------------------

/**
 * Capitalises the first letter of a string.
 *
 * @example
 *   capitalise("vintage")  → "Vintage"
 */
export function capitalise(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates a string to `maxLength` characters and appends "…" if truncated.
 *
 * @example
 *   truncate("A very long description", 10)  → "A very lon…"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}
