/**
 * features/orders/index.ts
 *
 * Order-specific helper utilities.
 * These are pure functions — no React, no Supabase.
 *
 * Usage:
 *   import { formatOrderAmount, getOrderStatusLabel } from "@/features/orders";
 */

import type { OrderStatus } from "@/types";

// ---------------------------------------------------------------------------
// Amount Formatting
// ---------------------------------------------------------------------------

/**
 * Converts an amount in paise (smallest currency unit) to a human-readable
 * rupee string.
 *
 * @example
 *   formatOrderAmount(99900)  → "₹999"
 *   formatOrderAmount(129900) → "₹1,299"
 */
export function formatOrderAmount(amountInPaise: number, currency = "INR"): string {
  const amount = amountInPaise / 100;
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Status Labels
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable label for an order status.
 *
 * @example
 *   getOrderStatusLabel("paid")    → "Payment Successful"
 *   getOrderStatusLabel("pending") → "Payment Pending"
 *   getOrderStatusLabel("failed")  → "Payment Failed"
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "paid":
      return "Payment Successful";
    case "pending":
      return "Payment Pending";
    case "failed":
      return "Payment Failed";
  }
}

/**
 * Returns a Tailwind CSS color class for an order status.
 * Use this in dashboard / order history UI.
 */
export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case "paid":
      return "text-emerald-600";
    case "pending":
      return "text-amber-600";
    case "failed":
      return "text-red-500";
  }
}

// ---------------------------------------------------------------------------
// Razorpay Receipt Helpers
// ---------------------------------------------------------------------------

/**
 * Formats a Razorpay payment ID for display.
 * Shows only the last 8 characters to avoid overwhelming the user.
 *
 * @example
 *   formatPaymentId("pay_AbCdEfGhIjKlMn") → "pay_…IjKlMn"
 */
export function formatPaymentId(paymentId: string | null | undefined): string {
  if (!paymentId) return "—";
  if (paymentId.length <= 12) return paymentId;
  return `${paymentId.slice(0, 4)}…${paymentId.slice(-8)}`;
}
