/**
 * TemplateService.ts
 *
 * Data access layer for the Template domain.
 * Supports Supabase persistence with fallback to static/memory state.
 */

import { TEMPLATES } from "@/data/templates";
import type { Template, TemplateCategory, TemplateVisibility } from "@/types";
import { createClient as createBrowserClient } from "@/lib/supabase/browser";

// In-memory store fallback when Supabase is disconnected or table is empty
let inMemoryTemplates: Template[] = [...TEMPLATES];

export class TemplateService {
  /**
   * Returns all published templates for the public catalog.
   */
  static async getAll(): Promise<Template[]> {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("visibility", "published")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(this.mapDbToTemplate);
      }
    } catch {
      // Fallback
    }

    return inMemoryTemplates.filter((t) => !t.visibility || t.visibility === "published");
  }

  /**
   * Returns ALL templates (published, draft, archived, hidden) for Admin CMS.
   */
  static async getAllAdmin(): Promise<Template[]> {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(this.mapDbToTemplate);
      }
    } catch {
      // Fallback
    }

    return inMemoryTemplates;
  }

  /**
   * Returns a single template by slug.
   */
  static async getBySlug(slug: string): Promise<Template | null> {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return this.mapDbToTemplate(data);
      }
    } catch {
      // Fallback
    }

    const found = inMemoryTemplates.find((t) => t.slug === slug);
    return found ?? null;
  }

  /**
   * Returns a single template by ID.
   */
  static async getById(id: string): Promise<Template | null> {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return this.mapDbToTemplate(data);
      }
    } catch {
      // Fallback
    }

    const found = inMemoryTemplates.find((t) => t.id === id);
    return found ?? null;
  }

  /**
   * Returns templates by category.
   */
  static async getByCategory(category: TemplateCategory): Promise<Template[]> {
    const all = await this.getAll();
    return all.filter((t) => t.category === category);
  }

  /**
   * Returns all unique template slugs.
   */
  static async getAllSlugs(): Promise<string[]> {
    const all = await this.getAll();
    const slugs = all.map((t) => t.slug);
    return Array.from(new Set(slugs));
  }

  /**
   * Creates a new template record.
   */
  static async create(templateData: Omit<Template, "id">): Promise<Template> {
    const existingIndex = inMemoryTemplates.findIndex((t) => t.slug === templateData.slug);
    const newId = existingIndex !== -1 ? inMemoryTemplates[existingIndex].id : (templateData.slug || `tpl_${Date.now()}`);

    const newTemplate: Template = {
      id: newId,
      visibility: "published",
      featured: false,
      displayOrder: existingIndex !== -1 ? (inMemoryTemplates[existingIndex].displayOrder ?? 0) : inMemoryTemplates.length,
      ...templateData,
    };

    try {
      const supabase = createBrowserClient();
      const dbPayload = this.mapTemplateToDb(newTemplate);
      const { data, error } = await supabase
        .from("templates")
        .upsert(dbPayload, { onConflict: "slug" })
        .select()
        .single();

      if (!error && data) {
        const created = this.mapDbToTemplate(data);
        if (existingIndex !== -1) {
          inMemoryTemplates[existingIndex] = created;
        } else {
          inMemoryTemplates.unshift(created);
        }
        return created;
      }
    } catch {
      // Fallback
    }

    if (existingIndex !== -1) {
      inMemoryTemplates[existingIndex] = newTemplate;
    } else {
      inMemoryTemplates.unshift(newTemplate);
    }
    return newTemplate;
  }

  /**
   * Updates an existing template metadata record.
   */
  static async update(id: string, updates: Partial<Omit<Template, "id">>): Promise<Template> {
    try {
      const supabase = createBrowserClient();
      const dbPayload = this.mapPartialTemplateToDb(updates);
      const { data, error } = await supabase
        .from("templates")
        .update(dbPayload)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated = this.mapDbToTemplate(data);
        const idx = inMemoryTemplates.findIndex((t) => t.id === id);
        if (idx !== -1) inMemoryTemplates[idx] = updated;
        return updated;
      }
    } catch {
      // Fallback
    }

    const idx = inMemoryTemplates.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Template not found with ID: ${id}`);
    inMemoryTemplates[idx] = { ...inMemoryTemplates[idx], ...updates };
    return inMemoryTemplates[idx];
  }

  /**
   * Updates visibility state (draft, published, archived, hidden).
   */
  static async updateVisibility(id: string, visibility: TemplateVisibility): Promise<Template> {
    return this.update(id, { visibility });
  }

  /**
   * Bulk updates visibility states for multiple IDs.
   */
  static async bulkUpdateVisibility(ids: string[], visibility: TemplateVisibility): Promise<void> {
    for (const id of ids) {
      await this.updateVisibility(id, visibility);
    }
  }

  /**
   * Duplicates a template's metadata.
   */
  static async duplicate(id: string): Promise<Template> {
    const original = await this.getById(id);
    if (!original) throw new Error(`Template not found: ${id}`);

    const cloneData: Omit<Template, "id"> = {
      ...original,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString(36).substring(4)}`,
      visibility: "draft",
    };

    return this.create(cloneData);
  }

  /**
   * Deletes a template record.
   */
  static async delete(id: string): Promise<void> {
    try {
      const supabase = createBrowserClient();
      await supabase.from("templates").delete().eq("id", id);
    } catch {
      // Fallback
    }
    inMemoryTemplates = inMemoryTemplates.filter((t) => t.id !== id);
  }

  // ---------------------------------------------------------------------------
  // Mapping Helpers (DB Snake_Case <-> JS CamelCase)
  // ---------------------------------------------------------------------------

  private static mapDbToTemplate(row: Record<string, unknown>): Template {
    return {
      id: String(row.id || ""),
      slug: String(row.slug || ""),
      name: String(row.name || ""),
      price: Number(row.price || 0),
      originalPrice: Number(row.original_price || row.originalPrice || 0),
      rating: Number(row.rating || 5),
      reviewsCount: Number(row.reviews_count || row.reviewsCount || 0),
      category: (row.category || "Traditional") as TemplateCategory,
      description: String(row.description || ""),
      thumbnail: String(row.thumbnail || row.thumbnail_url || ""),
      features: (row.features as string[]) || [],
      defaultData: (row.default_data || row.defaultData || {}) as Template["defaultData"],
      visibility: (row.visibility as TemplateVisibility) || "published",
      featured: Boolean(row.featured),
      displayOrder: Number(row.display_order || row.displayOrder || 0),
      priority: Number(row.priority || 0),
      gallery: (row.gallery as string[]) || [],
      audioUrl: String(row.audio_url || row.audioUrl || ""),
      seoMetadata: (row.seo_metadata || row.seoMetadata || {}) as Template["seoMetadata"],
    };
  }

  private static mapTemplateToDb(t: Template): Record<string, unknown> {
    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      price: t.price,
      original_price: t.originalPrice,
      rating: t.rating,
      reviews_count: t.reviewsCount,
      category: t.category,
      description: t.description,
      thumbnail: t.thumbnail,
      features: t.features,
      default_data: t.defaultData,
      visibility: t.visibility || "draft",
      featured: t.featured || false,
      display_order: t.displayOrder || 0,
      priority: t.priority || 0,
      gallery: t.gallery || [],
      audio_url: t.audioUrl || "",
      seo_metadata: t.seoMetadata || {},
    };
  }

  private static mapPartialTemplateToDb(updates: Partial<Omit<Template, "id">>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
    if (updates.rating !== undefined) payload.rating = updates.rating;
    if (updates.reviewsCount !== undefined) payload.reviews_count = updates.reviewsCount;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.thumbnail !== undefined) payload.thumbnail = updates.thumbnail;
    if (updates.features !== undefined) payload.features = updates.features;
    if (updates.defaultData !== undefined) payload.default_data = updates.defaultData;
    if (updates.visibility !== undefined) payload.visibility = updates.visibility;
    if (updates.featured !== undefined) payload.featured = updates.featured;
    if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.gallery !== undefined) payload.gallery = updates.gallery;
    if (updates.audioUrl !== undefined) payload.audio_url = updates.audioUrl;
    if (updates.seoMetadata !== undefined) payload.seo_metadata = updates.seoMetadata;
    return payload;
  }
}
