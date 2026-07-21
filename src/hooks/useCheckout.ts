"use client";

/**
 * useCheckout.ts
 *
 * React state machine for the complete Razorpay payment flow.
 *
 * Responsibilities:
 *   1. Validate billing form before starting payment
 *   2. Call POST /api/orders/create → get razorpay_order_id + our DB order_id
 *   3. Load Razorpay JS SDK dynamically (avoids SSR issues)
 *   4. Open Razorpay Checkout modal with the returned order details
 *   5. On payment success: call POST /api/orders/verify (server HMAC check)
 *   6. On verified: redirect to /success?orderId=<db_order_id>
 *   7. On failure / cancel: set status=failed, expose retry
 *
 * Architecture:
 *   CheckoutPage → useCheckout() → /api/orders/* → Razorpay SDK → Supabase
 *
 * Rules:
 *   - No Razorpay secret here (client-only hook)
 *   - Components never touch Razorpay directly
 *   - All error states are surfaced via hook return values
 *
 * Usage:
 *   const { checkoutState, startPayment, retryPayment } = useCheckout(projectId);
 */

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { BillingFormData } from "@/validations/order.validation";
import { validateBillingForm } from "@/validations/order.validation";
import type {
  CreateOrderResponse,
  VerifyPaymentResponse,
  RazorpaySuccessResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Hook State Types
// ---------------------------------------------------------------------------

export type CheckoutStep =
  | "idle"          // Waiting for user to click Pay
  | "creating"      // Calling /api/orders/create
  | "razorpay"      // Razorpay modal is open
  | "verifying"     // Calling /api/orders/verify
  | "success"       // Verified — redirecting
  | "failed"        // Payment failed or cancelled
  | "error";        // Unexpected system error

export interface CheckoutState {
  step: CheckoutStep;
  /** Friendly status message shown inside the processing overlay. */
  statusMessage: string;
  /** Error message shown when step === 'failed' or 'error'. */
  errorMessage: string | null;
  /** Billing form validation errors keyed by field name. */
  formErrors: Record<string, string>;
  /** The internal DB order ID, available after creation. */
  orderId: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Dynamically loads the Razorpay checkout script.
 * Safe to call multiple times — resolves immediately if already loaded.
 */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK."));
    document.body.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCheckout(projectId: string | null) {
  const router = useRouter();

  const [state, setState] = useState<CheckoutState>({
    step: "idle",
    statusMessage: "",
    errorMessage: null,
    formErrors: {},
    orderId: null,
  });

  // Track the current order_id in a ref so the Razorpay callback closure always
  // has access to the latest value without needing to close over state.
  const orderIdRef = useRef<string | null>(null);

  // -------------------------------------------------------------------------
  // Internal state helpers
  // -------------------------------------------------------------------------

  const setStep = (
    step: CheckoutStep,
    statusMessage = "",
    extra: Partial<CheckoutState> = {}
  ) => {
    setState((prev) => ({ ...prev, step, statusMessage, ...extra }));
  };

  // -------------------------------------------------------------------------
  // startPayment
  // -------------------------------------------------------------------------

  const startPayment = useCallback(
    async (billing: BillingFormData, customerName: string) => {
      // 1. Validate billing form
      const errors = validateBillingForm(billing);
      if (errors.length > 0) {
        const formErrors: Record<string, string> = {};
        errors.forEach((e) => { formErrors[e.field] = e.message; });
        setState((prev) => ({ ...prev, formErrors, step: "idle" }));
        return;
      }

      if (!projectId) {
        setStep("error", "", { errorMessage: "No active project found. Please go back and customize your invitation first." });
        return;
      }

      // 2. Create Razorpay order (server determines amount)
      setStep("creating", "Connecting to payment gateway...");

      let orderData: CreateOrderResponse;
      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_id: projectId }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to create order.");
        }

        orderData = json as CreateOrderResponse;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error. Please try again.";
        setStep("error", "", { errorMessage: msg });
        return;
      }

      orderIdRef.current = orderData.order_id;
      setState((prev) => ({
        ...prev,
        orderId: orderData.order_id,
        step: "razorpay",
        statusMessage: "Opening secure checkout...",
        formErrors: {},
      }));

      // 3. Load Razorpay SDK
      try {
        await loadRazorpayScript();
      } catch {
        setStep("error", "", { errorMessage: "Could not load payment SDK. Check your internet connection." });
        return;
      }

      // 4. Open Razorpay Checkout modal
      const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!rzpKeyId) {
        setStep("error", "", { errorMessage: "Payment configuration error. Please contact support." });
        return;
      }

      const rzp = new window.Razorpay({
        key: rzpKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Varnam Invites",
        description: "Premium Digital Wedding Invitation",
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: customerName || billing.name,
          email: billing.email,
          contact: `${billing.countryCode}${billing.phone}`,
        },
        theme: {
          color: "#6B3D00",
        },
        handler: async (response: RazorpaySuccessResponse) => {
          // Inline verification — avoids exhaustive-deps issue with nested useCallbacks
          const currentOrderId = orderIdRef.current;

          if (!currentOrderId) {
            setStep("error", "", { errorMessage: "Order reference lost. Please contact support." });
            return;
          }

          setStep("verifying", "Verifying payment signature...");

          try {
            const res = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: currentOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const result: VerifyPaymentResponse = await res.json();

            if (!res.ok || !result.success) {
              throw new Error(result.message || "Verification failed.");
            }

            setStep("success", "Payment successful! Redirecting...");
            setTimeout(() => {
              router.push(`/success?orderId=${currentOrderId}`);
            }, 1500);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Verification failed. Please contact support.";
            setStep("failed", "", { errorMessage: msg });
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the modal — mark as failed, allow retry
            setStep("failed", "", {
              errorMessage: "Payment was cancelled. You can retry below.",
            });
          },
        },
      });

      rzp.open();
    },
    [projectId, router]
  );


  // -------------------------------------------------------------------------
  // retryPayment — resets state to idle without losing project
  // -------------------------------------------------------------------------

  const retryPayment = useCallback(() => {
    orderIdRef.current = null;
    setState({
      step: "idle",
      statusMessage: "",
      errorMessage: null,
      formErrors: {},
      orderId: null,
    });
  }, []);

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    checkoutState: state,
    startPayment,
    retryPayment,
  };
}
