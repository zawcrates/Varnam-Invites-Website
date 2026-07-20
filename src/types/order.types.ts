/**
 * order.types.ts
 *
 * Type definitions for the Order / Payment domain.
 *
 * An Order is the financial transaction record tied to an Invitation purchase.
 * Sprint 4 (Payment) will wire these to Razorpay's actual API.
 * Currently the checkout page simulates this flow using localStorage.
 *
 * Sprint status: Defined now. Used in Sprint 4 (Publishing Engine).
 */

// ---------------------------------------------------------------------------
// OrderStatus
// ---------------------------------------------------------------------------

/**
 * Payment processing state for an Order.
 * - `pending`   – Order created; awaiting payment.
 * - `success`   – Payment verified; invitation published.
 * - `failed`    – Payment attempt rejected by gateway.
 * - `refunded`  – Payment reversed.
 */
export type OrderStatus = "pending" | "success" | "failed" | "refunded";

// ---------------------------------------------------------------------------
// PaymentGateway
// ---------------------------------------------------------------------------

/** Supported payment gateways. Razorpay is the primary for Indian market. */
export type PaymentGateway = "razorpay" | "stripe";

// ---------------------------------------------------------------------------
// PaymentRecord
// ---------------------------------------------------------------------------

/** Raw data returned from / sent to the payment gateway. */
export interface PaymentRecord {
  /** Gateway-assigned payment ID, e.g. "pay_AbCdEfGhIjKl". */
  gatewayPaymentId: string;
  /** Gateway-assigned order ID, e.g. "order_AbCdEfGhIjKl". */
  gatewayOrderId: string;
  /** HMAC signature for server-side verification. */
  signature: string;
  /** Which gateway processed this payment. */
  gateway: PaymentGateway;
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------

/**
 * A single purchase transaction record.
 * One Order maps to exactly one Invitation.
 */
export interface Order {
  /** Unique order ID (UUID). */
  id: string;
  /** Foreign key — the Invitation this order is for. */
  invitationId: string;
  /** Email of the buyer. */
  userEmail: string;
  /** Amount charged, in INR whole rupees. */
  amount: number;
  /** ISO 4217 currency code. Default: "INR". */
  currency: string;
  /** Current payment state. */
  status: OrderStatus;
  /** Payment gateway data. Null until payment is attempted. */
  paymentRecord: PaymentRecord | null;
  /** ISO 8601 timestamp of order creation. */
  createdAt: string;
}
