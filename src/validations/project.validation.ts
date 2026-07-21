/**
 * project.validation.ts
 *
 * Validation helpers for Project data.
 *
 * Sprint 3: Lightweight guard functions only.
 * Sprint 5+: Migrate to Zod schemas when form complexity grows.
 *
 * Usage:
 *   import { validateProjectTitle, sanitizeProjectTitle } from "@/validations";
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PROJECT_TITLE_MAX_LENGTH = 120;
export const PROJECT_TITLE_MIN_LENGTH = 1;

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

/**
 * Returns true if the project title is a non-empty string within the allowed
 * character limit.
 *
 * @example
 *   validateProjectTitle("Virat & Anushka Wedding") → true
 *   validateProjectTitle("")                         → false
 */
export function validateProjectTitle(title: string): boolean {
  const trimmed = title.trim();
  return (
    trimmed.length >= PROJECT_TITLE_MIN_LENGTH &&
    trimmed.length <= PROJECT_TITLE_MAX_LENGTH
  );
}

/**
 * Sanitizes a raw template slug + couple names into a human-readable project
 * title. Used when auto-generating a title on first project creation.
 *
 * @example
 *   generateProjectTitle("vintage-parchment", "Virat", "Anushka")
 *   → "Virat & Anushka – Vintage Parchment Scroll"
 */
export function generateProjectTitle(
  templateSlug: string,
  groomName?: string,
  brideName?: string
): string {
  const templateLabel = templateSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (groomName && brideName) {
    return `${groomName} & ${brideName} – ${templateLabel}`;
  }
  return `My ${templateLabel} Draft`;
}
