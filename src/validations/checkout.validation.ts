/**
 * checkout.validation.ts
 *
 * Validation rules for the checkout billing form.
 *
 * Current state (Sprint 1):
 *   Plain TypeScript validation functions that mirror the inline validation
 *   currently in src/app/checkout/page.tsx.
 *
 * Sprint 4 migration:
 *   Replace with a Zod schema. The function signatures and error message
 *   strings will remain the same — only the internal implementation changes.
 *
 * Usage:
 *   import { validateCheckoutForm } from "@/validations";
 *   const errors = validateCheckoutForm({ name, email, phone, countryCode });
 *   if (errors.length > 0) { ... }
 */

import { EMAIL_REGEX, INDIA_PHONE_REGEX, INTL_PHONE_REGEX } from "@/utils/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface ValidationError {
  field: keyof CheckoutFormData;
  message: string;
}

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

/**
 * Validates the complete checkout billing form.
 * Returns an array of ValidationError objects.
 * An empty array means the form is valid.
 *
 * @example
 *   const errors = validateCheckoutForm({ name: "Virat", email: "bad", phone: "123", countryCode: "+91" });
 *   // → [{ field: "email", message: "Please enter a valid email address." }, ...]
 */
export function validateCheckoutForm(data: CheckoutFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name
  if (!data.name.trim()) {
    errors.push({ field: "name", message: "Please enter your full name." });
  }

  // Email
  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Please enter your email address." });
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  // Phone
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
 * Returns the first error message for a specific field, or null if valid.
 * Convenient for showing inline field-level error messages.
 *
 * @example
 *   const emailError = getFieldError(errors, "email");
 *   // → "Please enter a valid email address." | null
 */
export function getFieldError(
  errors: ValidationError[],
  field: keyof CheckoutFormData
): string | null {
  return errors.find((e) => e.field === field)?.message ?? null;
}
