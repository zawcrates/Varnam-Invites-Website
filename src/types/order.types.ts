/**
 * order.types.ts
 *
 * Domain types for the Order / Payment entity.
 *
 * An Order is the financial record of a payment against a Project.
 * It ties together the Razorpay transaction with the Project lifecycle.
 *
 * Sprint 4: pending → paid | failed
 * Sprint 5+: refunded, cancelled (do not add now)
 *
 * Usage:
 *   import type { Order, OrderStatus } from "@/types";
 */

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

/**
 * Lifecycle status of a payment order.
 *
 * pending → Order created; Razorpay checkout opened.
 * paid    → Signature verified server-side; Project marked paid.
 * failed  → Payment rejected or cancelled; Project stays draft.
 */
export type OrderStatus = "pending" | "paid" | "failed";

// ---------------------------------------------------------------------------
// Database Entity
// ---------------------------------------------------------------------------

/**
 * Full order record as stored in public.orders.
 * Mirrors the database table exactly — no derived fields.
 *
 * Design notes (per Sprint 4 review):
 *   - razorpay_signature is NOT stored (verification-only, not operational).
 *   - amount is a snapshot at time of purchase (price changes don't affect history).
 *   - verified_at records when server-side verification succeeded.
 *   - paid_at records when the order transitioned to paid.
 */
export interface Order {
  id: string;
  project_id: string;
  user_id: string;
  template_slug: string;
  /** Amount in smallest currency unit (paise for INR). e.g. ₹999 → 99900 */
  amount: number;
  currency: string;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  failure_reason: string | null;
  verified_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// API Payloads
// ---------------------------------------------------------------------------

/**
 * Request body sent to POST /api/orders/create.
 * The client only sends project_id — server determines amount from catalog.
 */
export interface CreateOrderRequest {
  project_id: string;
}

/**
 * Response from POST /api/orders/create on success.
 */
export interface CreateOrderResponse {
  /** Our internal DB order ID (UUID). */
  order_id: string;
  /** Razorpay order ID — passed to Razorpay Checkout SDK. */
  razorpay_order_id: string;
  /** Amount in paise (e.g. ₹999 → 99900). */
  amount: number;
  /** ISO 4217 currency code. */
  currency: string;
}

/**
 * Request body sent to POST /api/orders/verify.
 * Razorpay returns these three values in the payment.success callback.
 */
export interface VerifyPaymentRequest {
  /** Our internal DB order ID (UUID). */
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Response from POST /api/orders/verify.
 */
export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// Razorpay SDK (browser) types
// Minimal typings for the global Razorpay constructor injected by the CDN script.
// ---------------------------------------------------------------------------

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}
