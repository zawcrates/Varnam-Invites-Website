/**
 * order.validation.ts
 *
 * Validation helpers for the checkout billing form before initiating payment.
 *
 * Sprint 4: Lightweight guard functions.
 * Sprint 6+: Migrate to Zod if form complexity grows.
 *
 * Usage:
 *   import { validateBillingForm, getBillingFieldError } from "@/validations";
 */

import { EMAIL_REGEX, INDIA_PHONE_REGEX, INTL_PHONE_REGEX } from "@/utils/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BillingFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface BillingValidationError {
  field: keyof BillingFormData;
  message: string;
}

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

/**
 * Validates the complete checkout billing form.
 * Returns an array of errors. Empty array means valid.
 *
 * @example
 *   const errors = validateBillingForm({ name: "Virat", email: "bad", phone: "123", countryCode: "+91" });
 *   // → [{ field: "email", message: "..." }]
 */
export function validateBillingForm(data: BillingFormData): BillingValidationError[] {
  const errors: BillingValidationError[] = [];

  if (!data.name.trim()) {
    errors.push({ field: "name", message: "Please enter your full name." });
  }

  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Please enter your email address." });
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  const cleanPhone = data.phone.trim().replace(/\s+/g, "");

  if (!cleanPhone) {
    errors.push({ field: "phone", message: "Please enter your phone number." });
  } else {
    const isValid =
      data.countryCode === "+91"
        ? INDIA_PHONE_REGEX.test(cleanPhone)
        : INTL_PHONE_REGEX.test(cleanPhone);

    if (!isValid) {
      errors.push({
        field: "phone",
        message:
          data.countryCode === "+91"
            ? "Please enter a valid 10-digit mobile number."
            : "Please enter a valid phone number (7 to 14 digits).",
      });
    }
  }

  return errors;
}

/**
 * Returns the first error message for a specific billing field, or null.
 *
 * @example
 *   const err = getBillingFieldError(errors, "email"); // → "..." | null
 */
export function getBillingFieldError(
  errors: BillingValidationError[],
  field: keyof BillingFormData
): string | null {
  return errors.find((e) => e.field === field)?.message ?? null;
}
