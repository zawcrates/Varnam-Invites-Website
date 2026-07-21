/**
 * features/projects/index.ts
 *
 * Barrel export for the projects feature module.
 *
 * This folder contains project-specific helper utilities that don't belong
 * in the service layer (pure business logic) or the hook (React lifecycle).
 *
 * Usage:
 *   import { buildProjectLocalKey, isProjectStale } from "@/features/projects";
 */

// ---------------------------------------------------------------------------
// localStorage Keys
// ---------------------------------------------------------------------------

/**
 * Returns the localStorage key used to cache formData for a specific template.
 *
 * @example
 *   buildProjectLocalKey("vintage-parchment") → "varnam_custom_vintage-parchment"
 */
export function buildProjectLocalKey(templateSlug: string): string {
  return `varnam_custom_${templateSlug}`;
}

/**
 * Returns the localStorage key used to pass the active customization
 * to the checkout page.
 */
export const CHECKOUT_SLUG_KEY = "varnam_active_slug";
export const CHECKOUT_DATA_KEY = "varnam_active_custom_data";

// ---------------------------------------------------------------------------
// Project State Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if a project's `updated_at` timestamp is older than the
 * provided threshold (in milliseconds). Useful for determining if a cached
 * draft may be stale.
 *
 * @param updatedAt - ISO timestamp string from the project record.
 * @param thresholdMs - Age threshold in milliseconds (default: 7 days).
 *
 * @example
 *   isProjectStale("2024-01-01T00:00:00Z") → true
 */
export function isProjectStale(
  updatedAt: string,
  thresholdMs = 7 * 24 * 60 * 60 * 1000
): boolean {
  const age = Date.now() - new Date(updatedAt).getTime();
  return age > thresholdMs;
}

/**
 * Formats a `last_opened_at` or `updated_at` timestamp into a human-readable
 * relative time string suitable for dashboard display.
 *
 * @example
 *   formatProjectTime("2024-01-01T10:00:00Z") → "5 minutes ago"
 */
export function formatProjectTime(isoString: string | null | undefined): string {
  if (!isoString) return "Never opened";

  const date = new Date(isoString);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
