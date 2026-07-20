/**
 * invitation.types.ts
 *
 * Type definitions for the Invitation domain.
 *
 * An Invitation is created when a user completes the checkout flow.
 * It stores their personalized InviteData, billing details, and payment status.
 * These types mirror the `public.invitations` Supabase table.
 *
 * Sprint status: Defined now. Used in Sprint 3 (Database Redesign) when
 * InvitationService is wired to Supabase.
 */

import type { InviteData } from "./template.types";

// ---------------------------------------------------------------------------
// BillingDetails
// ---------------------------------------------------------------------------

/** Contact and billing information collected during checkout. */
export interface BillingDetails {
  /** Full name of the buyer. */
  name: string;
  /** Email address — used for order confirmation and invite linking. */
  email: string;
  /** Full phone number including country code prefix, e.g. "+911234567890". */
  phone: string;
}

// ---------------------------------------------------------------------------
// InvitationStatus
// ---------------------------------------------------------------------------

/**
 * Lifecycle state of an invitation.
 * - `draft`     – Created but not paid; not yet published.
 * - `paid`      – Payment confirmed; invitation is live and publicly accessible.
 * - `expired`   – Hosting period has ended (1-year window).
 */
export type InvitationStatus = "draft" | "paid" | "expired";

// ---------------------------------------------------------------------------
// Invitation
// ---------------------------------------------------------------------------

/**
 * A user's purchased and published wedding invitation.
 * Corresponds to a row in the `public.invitations` Supabase table.
 */
export interface Invitation {
  /** Unique invitation ID (UUID). Also the public URL token: /invitation/[id] */
  id: string;
  /** Slug of the template used, e.g. "vintage-parchment". */
  templateSlug: string;
  /** The personalized invite data entered by the user. */
  inviteData: InviteData;
  /** Billing details collected during checkout. */
  billingDetails: BillingDetails;
  /** Email of the user who owns this invitation. Used for /my-invites linking. */
  userEmail: string;
  /** Whether payment has been confirmed. Drives public visibility. */
  isPaid: boolean;
  /** Razorpay or other payment gateway transaction ID. Null until paid. */
  paymentId: string | null;
  /** ISO 8601 timestamp of record creation. */
  createdAt: string;
  /** ISO 8601 timestamp of last update (auto-managed by DB trigger). */
  updatedAt: string;
}
