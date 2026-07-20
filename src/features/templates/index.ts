/**
 * src/features/templates/index.ts
 *
 * Public API surface for the Templates feature.
 *
 * This file re-exports everything that external code (pages, components)
 * should import when working with templates. It intentionally hides the
 * internal data source (currently `@/data/templates`) behind this facade.
 *
 * Sprint 3 migration:
 *   When the static array is replaced by live Supabase data, only this
 *   file and TemplateService.ts need to change — no page or component update.
 *
 * Usage:
 *   import { TEMPLATES, TemplateService } from "@/features/templates";
 *   import type { Template, InviteData } from "@/features/templates";
 */

// Re-export static data array — keeps existing page imports working
// while signalling that this is the "official" import path going forward.
export { TEMPLATES } from "@/data/templates";

// Re-export the service class for data access
export { TemplateService } from "@/services/TemplateService";

// Re-export canonical types
export type {
  Template,
  InviteData,
  EventItem,
  TemplateCategory,
} from "@/types/template.types";
