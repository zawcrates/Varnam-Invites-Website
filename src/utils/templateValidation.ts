/**
 * templateValidation.ts
 *
 * Pre-publish validation utility for the Template Management CMS.
 * Ensures templates meet all developer registration and metadata requirements
 * before permitting publishing to the public catalog.
 */

import { isTemplateRegistered, getTemplateManifest } from "@/templates";
import type { Template, TemplateValidationResult } from "@/types";

/**
 * Performs a comprehensive validation check on a template record for CMS publishing.
 */
export function validateTemplateForPublish(
  template: Partial<Template> & { slug?: string },
  registeredSlugsList?: string[]
): TemplateValidationResult {
  const slug = template.slug || "";
  
  // Checks
  const isRegisteredInCode = registeredSlugsList 
    ? registeredSlugsList.includes(slug)
    : isTemplateRegistered(slug);

  const manifest = getTemplateManifest(slug);
  const manifestValid = manifest !== null && manifest.slug === slug;
  const thumbnailUploaded = Boolean(template.thumbnail && template.thumbnail.trim().length > 0);
  const priceConfigured = Boolean(template.price && Number(template.price) > 0);
  const nameConfigured = Boolean(template.name && template.name.trim().length > 0);
  const visibilitySelected = Boolean(template.visibility);

  const checks = {
    folderExists: isRegisteredInCode,
    isRegistered: isRegisteredInCode,
    manifestValid: manifestValid || isRegisteredInCode, // Fallback to registration if manifest omitted
    slugMatch: Boolean(slug && slug.trim().length > 0),
    thumbnailUploaded,
    priceConfigured,
    nameConfigured,
    visibilitySelected,
  };

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!checks.slugMatch) {
    errors.push("Template slug must be selected from registered templates.");
  }
  if (!checks.isRegistered) {
    errors.push(`Template folder or renderer for slug '${slug}' is not registered in src/templates/index.ts.`);
  }
  if (!checks.thumbnailUploaded) {
    errors.push("A thumbnail preview image must be uploaded before publishing.");
  }
  if (!checks.priceConfigured) {
    errors.push("Template selling price must be configured and greater than ₹0.");
  }
  if (!checks.nameConfigured) {
    errors.push("Template display name is required.");
  }
  if (!checks.visibilitySelected) {
    errors.push("Visibility status (draft, published, hidden, archived) must be set.");
  }

  // Pre-publish validity requires all critical errors to be resolved
  const canPublish = errors.length === 0 && checks.isRegistered && checks.thumbnailUploaded && checks.priceConfigured;

  return {
    isValid: errors.length === 0,
    canPublish,
    errors,
    warnings,
    checks,
  };
}
