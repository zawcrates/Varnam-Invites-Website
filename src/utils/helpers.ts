/**
 * helpers.ts
 *
 * Pure utility / helper functions.
 *
 * Rules:
 *   - Every function is pure.
 *   - No React imports.
 *   - No direct localStorage calls (use useLocalStorage hook or constants.ts keys).
 *
 * Usage:
 *   import { generateInvitationId, buildShareUrl } from "@/utils";
 */

// ---------------------------------------------------------------------------
// ID Generation
// ---------------------------------------------------------------------------

/**
 * Generates a random invitation ID string.
 * Format: "invite_" + 9 alphanumeric characters (base-36).
 *
 * Sprint 3 note: When invitations are stored in Supabase, the DB will
 * generate a UUID. This helper will be used only for the localStorage
 * simulation and removed in Sprint 3.
 *
 * @example
 *   generateInvitationId()  → "invite_k2m9x4p7a"
 */
export function generateInvitationId(): string {
  return `invite_${Math.random().toString(36).substring(2, 11)}`;
}

// ---------------------------------------------------------------------------
// URL Helpers
// ---------------------------------------------------------------------------

/**
 * Builds the full public URL for a published invitation.
 *
 * @param invitationId - The unique invitation ID.
 * @param baseUrl      - Optional base URL override (defaults to window.origin in browser).
 *
 * @example
 *   buildShareUrl("invite_k2m9x4p7a")
 *   → "https://varnaminvites.com/invitation/invite_k2m9x4p7a"
 */
export function buildShareUrl(invitationId: string, baseUrl?: string): string {
  const origin =
    baseUrl ??
    (typeof window !== "undefined" ? window.location.origin : "https://varnaminvites.com");
  return `${origin}/invitation/${invitationId}`;
}

/**
 * Builds a WhatsApp share URL with a pre-filled message.
 *
 * @param shareUrl    - The invitation URL to share.
 * @param groomName   - Groom's name for the message.
 * @param brideName   - Bride's name for the message.
 *
 * @example
 *   buildWhatsappShareUrl("https://...", "Virat", "Anushka")
 *   → "https://api.whatsapp.com/send?text=..."
 */
export function buildWhatsappShareUrl(
  shareUrl: string,
  groomName: string,
  brideName: string
): string {
  const message = encodeURIComponent(
    `🎊 You're invited to the wedding of ${groomName} & ${brideName}!\n\nView our digital invitation: ${shareUrl}`
  );
  return `https://api.whatsapp.com/send?text=${message}`;
}

// ---------------------------------------------------------------------------
// Slug Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a display name to a URL-safe slug.
 *
 * @example
 *   sanitizeSlug("Vintage Parchment Scroll")  → "vintage-parchment-scroll"
 */
export function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ---------------------------------------------------------------------------
// Validation Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the given string is a non-empty string after trimming.
 */
export function isNonEmpty(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Strips all non-digit characters from a phone number string.
 *
 * @example
 *   cleanPhoneNumber("+91 98765 43210")  → "919876543210"
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ---------------------------------------------------------------------------
// Array Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a new array with duplicate values removed.
 * Works for arrays of primitives.
 *
 * @example
 *   unique(["a", "b", "a"])  → ["a", "b"]
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
