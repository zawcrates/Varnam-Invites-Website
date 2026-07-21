/**
 * features/publishing/index.ts
 *
 * Helper utilities for the Publishing Engine.
 * Covers slug formatting, availability verification, and URL construction.
 *
 * Usage:
 *   import { cleanSlug, buildPublicInvitationUrl } from "@/features/publishing";
 */

/**
 * Normalizes user input (groom/bride names) into a clean, URL-safe, lowercase ASCII slug.
 * Removes special characters, converts spaces/connectors to hyphens, and trims.
 *
 * @example
 *   cleanSlug("Virat & Anushka") → "virat-anushka"
 *   cleanSlug("Abhishek weds Aishwarya") → "abhishek-aishwarya"
 */
export function cleanSlug(name: string): string {
  return name
    .toLowerCase()
    // Replace typical connector words with a space, then we normalize spacing
    .replace(/\b(weds|and|&|with)\b/g, " ")
    // Keep only ASCII letters, numbers, and spaces/hyphens
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace multiple spaces/hyphens with a single space
    .trim()
    .replace(/[\s-]+/g, "-");
}

/**
 * Builds the fully qualified public URL for a published invitation.
 * Prepares the codebase for custom domains by taking the host as an input parameter.
 *
 * @example
 *   buildPublicInvitationUrl("virat-anushka", "localhost:3000") → "http://localhost:3000/invite/virat-anushka"
 */
export function buildPublicInvitationUrl(slug: string, host?: string): string {
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const baseHost = host || (typeof window !== "undefined" ? window.location.host : "varnaminvites.com");
  return `${protocol}://${baseHost}/invite/${slug}`;
}
