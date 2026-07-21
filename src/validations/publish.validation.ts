/**
 * publish.validation.ts
 *
 * Server-side validations for publishing requests.
 */

export interface PublishValidationResult {
  isValid: boolean;
  errorCode?: "NOT_FOUND" | "UNAUTHORIZED" | "UNPAID" | "ALREADY_PUBLISHED" | "DATABASE_ERROR";
  message?: string;
}

/**
 * Validates whether a project is eligible to be published.
 *
 * A project is eligible if:
 *   1. It exists.
 *   2. The user owns it.
 *   3. The project status is 'paid'.
 *
 * @param project - The project record fetched from the database.
 * @param userId - The ID of the authenticated user requesting the publish.
 */
export function validateProjectForPublishing(
  project: { user_id: string; status: string } | null,
  userId: string
): PublishValidationResult {
  if (!project) {
    return {
      isValid: false,
      errorCode: "NOT_FOUND",
      message: "The requested project was not found.",
    };
  }

  if (project.user_id !== userId) {
    return {
      isValid: false,
      errorCode: "UNAUTHORIZED",
      message: "You do not have permission to publish this project.",
    };
  }

  if (project.status !== "paid") {
    return {
      isValid: false,
      errorCode: "UNPAID",
      message: "This project cannot be published because it has not been paid for yet.",
    };
  }

  return { isValid: true };
}
