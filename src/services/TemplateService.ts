/**
 * TemplateService.ts
 *
 * Data access layer for the Template domain.
 *
 * This service is the single point of contact for all template data operations.
 * Components and pages must never import from `@/data/templates` directly;
 * they should call TemplateService instead.
 *
 * Current state (Sprint 1):
 *   All methods read from the static TEMPLATES array in `@/data/templates.ts`.
 *   No network calls are made.
 *
 * Sprint 3 migration path:
 *   Replace each method body with a Supabase query against `public.templates`.
 *   The method signatures stay identical — zero changes to callers.
 *
 * Why a class?
 *   - Groups related methods under a single namespace.
 *   - Easy to mock in unit tests (`jest.spyOn(TemplateService, 'getBySlug')`).
 *   - Easy to inject a Supabase client later without refactoring the call sites.
 */

import { TEMPLATES } from "@/data/templates";
import type { Template, TemplateCategory } from "@/types";

export class TemplateService {
  // ---------------------------------------------------------------------------
  // Read operations
  // ---------------------------------------------------------------------------

  /**
   * Returns all available templates.
   * Sprint 3: Will become `supabase.from('templates').select('*')`.
   */
  static async getAll(): Promise<Template[]> {
    return TEMPLATES;
  }

  /**
   * Returns a single template by its URL slug.
   * Returns `null` if no template matches (callers should handle 404).
   *
   * @param slug - e.g. "vintage-parchment"
   */
  static async getBySlug(slug: string): Promise<Template | null> {
    const found = TEMPLATES.find((t) => t.slug === slug);
    return found ?? null;
  }

  /**
   * Returns a single template by its unique ID.
   * Returns `null` if no template matches.
   *
   * @param id - e.g. "vintage-parchment-01"
   */
  static async getById(id: string): Promise<Template | null> {
    const found = TEMPLATES.find((t) => t.id === id);
    return found ?? null;
  }

  /**
   * Returns all templates belonging to a specific category.
   *
   * @param category - One of "Vintage" | "Modern" | "Traditional" | "Floral"
   */
  static async getByCategory(category: TemplateCategory): Promise<Template[]> {
    return TEMPLATES.filter((t) => t.category === category);
  }

  /**
   * Returns all unique template slugs.
   * Used by Next.js `generateStaticParams` to pre-render template detail pages.
   */
  static async getAllSlugs(): Promise<string[]> {
    const slugs = TEMPLATES.map((t) => t.slug);
    // De-duplicate: multiple templates can share a slug (e.g. same renderer)
    return Array.from(new Set(slugs));
  }

  // ---------------------------------------------------------------------------
  // Sprint 3 placeholder stubs
  // The methods below have no implementation yet. They exist to:
  //   1. Reserve the API surface so Sprint 3 has clear contracts.
  //   2. Show future engineers what operations the service will support.
  // ---------------------------------------------------------------------------

  /**
   * [Sprint 3] Creates a new template record in the database.
   * Only callable by admin users with the service role key.
   */
  static async create(_template: Omit<Template, "id">): Promise<Template> {
    throw new Error("TemplateService.create() is not implemented until Sprint 3.");
  }

  /**
   * [Sprint 3] Updates an existing template record.
   * Only callable by admin users with the service role key.
   */
  static async update(
    _id: string,
    _data: Partial<Omit<Template, "id">>
  ): Promise<Template> {
    throw new Error("TemplateService.update() is not implemented until Sprint 3.");
  }
}
