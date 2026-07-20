/**
 * user.types.ts
 *
 * Type definitions for the User / Auth domain.
 *
 * UserProfile is stored in public.profiles table linked 1:1 to auth.users.
 */

// ---------------------------------------------------------------------------
// UserProfile
// ---------------------------------------------------------------------------

/**
 * Extended user profile stored in `public.profiles`.
 * Supplements the minimal data available in `auth.users`.
 */
export interface UserProfile {
  /** Matches the UUID from `auth.users.id`. */
  id: string;
  /** User's display name. */
  name: string;
  /** User's email address. Mirrors `auth.users.email`. */
  email: string;
  /** Optional phone number. */
  phone?: string;
  /** URL to the user's avatar image. */
  avatarUrl?: string;
  /** ISO 8601 timestamp of profile creation. */
  createdAt: string;
}

// ---------------------------------------------------------------------------
// AuthUser
// ---------------------------------------------------------------------------

/**
 * Lightweight auth session object used in UI state.
 */
export interface AuthUser {
  /** Supabase auth UUID. */
  id: string;
  /** Display name for greeting UI. */
  name: string;
  /** Email for account identification. */
  email: string;
}
