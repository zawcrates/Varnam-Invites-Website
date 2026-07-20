/**
 * auth.validation.ts
 *
 * Validation rules for authentication forms (login, signup).
 *
 * Current state (Sprint 1):
 *   Placeholder — the application uses a simulated auth flow.
 *   No real validation is needed yet, but the schema is designed
 *   so Sprint 2 can drop Zod rules in without restructuring.
 *
 * Sprint 2 migration:
 *   - Replace plain functions with Zod schemas.
 *   - Add password strength rules.
 *   - Add OTP validation for phone-based auth.
 *
 * Usage:
 *   import { validateLoginForm } from "@/validations";
 */

import { EMAIL_REGEX } from "@/utils/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthValidationError {
  field: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Login Validator
// ---------------------------------------------------------------------------

/**
 * [Sprint 1 stub] Validates the login form fields.
 * Sprint 2 will replace the body with a Zod parse call.
 */
export function validateLoginForm(data: LoginFormData): AuthValidationError[] {
  const errors: AuthValidationError[] = [];

  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  if (!data.password) {
    errors.push({ field: "password", message: "Password is required." });
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Signup Validator
// ---------------------------------------------------------------------------

/**
 * [Sprint 1 stub] Validates the signup form fields.
 * Sprint 2 will add password strength requirements.
 */
export function validateSignupForm(data: SignupFormData): AuthValidationError[] {
  const errors: AuthValidationError[] = [];

  if (!data.name.trim()) {
    errors.push({ field: "name", message: "Full name is required." });
  }

  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  if (!data.password) {
    errors.push({ field: "password", message: "Password is required." });
  } else if (data.password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters." });
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Passwords do not match." });
  }

  return errors;
}
