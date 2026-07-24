/**
 * constants.ts
 *
 * Application-wide constants.
 *
 * Rules for this file:
 *   - Only pure values (no functions, no imports from other src/ files).
 *   - Group by domain, separated by comments.
 *   - All string keys used with localStorage must be defined here.
 *     Never hardcode storage key strings in components or pages.
 */

// ---------------------------------------------------------------------------
// App Identity
// ---------------------------------------------------------------------------

export const APP_NAME = "Varnam Invites" as const;
export const APP_TAGLINE = "Premium Digital Wedding Invitations" as const;
export const SUPPORT_EMAIL = "varnaminvites@gmail.com" as const;
export const SUPPORT_PHONE = "+91 63792 37294" as const;
export const SUPPORT_LOCATION = "Chennai, India" as const;

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

export const CURRENCY_SYMBOL = "₹" as const;
export const CURRENCY_CODE = "INR" as const;

// ---------------------------------------------------------------------------
// localStorage Keys
// ---------------------------------------------------------------------------

/**
 * All keys used with localStorage in one place.
 * Prevents typos from causing silent storage misses.
 *
 * Usage:
 *   localStorage.getItem(STORAGE_KEYS.ACTIVE_SLUG)
 *   localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
 */
export const STORAGE_KEYS = {
  /** The slug of the template the user is currently customising. */
  ACTIVE_SLUG: "varnam_active_slug",
  /** The InviteData JSON the user has customised. */
  ACTIVE_CUSTOM_DATA: "varnam_active_custom_data",
  /** Serialised { name, email } of the signed-in user. */
  CURRENT_USER: "current_user",
  /** Hash map of all published invitations, keyed by invitation ID. */
  PUBLISHED_INVITATIONS: "varnam_published_invitations",
  /** Hash map of simulated user accounts, keyed by email. Used in Sprint 1 mock auth. */
  SIMULATED_USERS: "simulated_users",
} as const;

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * All internal application routes as typed constants.
 * Use these in <Link href={ROUTES.TEMPLATES}> instead of raw strings.
 * Prevents broken links when routes are renamed.
 */
export const ROUTES = {
  HOME: "/",
  TEMPLATES: "/templates",
  TEMPLATE_DETAIL: (slug: string) => `/templates/${slug}`,
  CUSTOMIZE: (slug: string) => `/customize/${slug}`,
  INVITATION: (id: string) => `/invitation/${id}`,
  INVITATION_PREVIEW: "/invitation/preview",
  CHECKOUT: "/checkout",
  SUCCESS: (id: string) => `/success?id=${id}`,
  MY_INVITES: "/my-invites",
} as const;

// ---------------------------------------------------------------------------
// Template Config
// ---------------------------------------------------------------------------

/** Maximum number of events shown in the event carousel. */
export const MAX_EVENTS = 5 as const;

/** Invitation hosting duration in years (Lifetime = 99 years). */
export const HOSTING_DURATION_YEARS = 99 as const;

// ---------------------------------------------------------------------------
// Checkout Validation
// ---------------------------------------------------------------------------

/** Regex for validating Indian mobile numbers (10 digits, starting 6–9). */
export const INDIA_PHONE_REGEX = /^[6-9]\d{9}$/;

/** Regex for validating international phone numbers (7–14 digits). */
export const INTL_PHONE_REGEX = /^\d{7,14}$/;

/** Regex for basic email format validation. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Supported Country Codes (for the phone input selector)
// ---------------------------------------------------------------------------

export const COUNTRY_CODES = [
  { label: "+91 (India)", value: "+91" },
  { label: "+1 (USA/Canada)", value: "+1" },
  { label: "+44 (UK)", value: "+44" },
  { label: "+971 (UAE)", value: "+971" },
  { label: "+65 (Singapore)", value: "+65" },
  { label: "+61 (Australia)", value: "+61" },
] as const;
