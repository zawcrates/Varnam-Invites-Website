/**
 * ProjectService.ts
 *
 * The ONLY layer that communicates with Supabase for Project data.
 *
 * Architecture:
 *   Component → useProject() → ProjectService → Supabase
 *
 * Rules:
 *   - React components MUST NOT import this service directly.
 *   - All Supabase project queries are encapsulated here.
 *   - Soft deletes are used: deleted_at is set instead of physical row removal.
 *   - All selects filter for deleted_at IS NULL.
 *
 * Usage:
 *   import { ProjectService } from "@/services";
 */

import { createClient } from "@/lib/supabase/browser";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/types";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getClient() {
  return createClient();
}

// ---------------------------------------------------------------------------
// ProjectService
// ---------------------------------------------------------------------------

export class ProjectService {
  /**
   * Creates a new project for the authenticated user.
   * Called only after the user's FIRST meaningful edit in the customizer.
   *
   * @throws If the insert fails (RLS violation, network error, etc.)
   */
  static async createProject(payload: CreateProjectPayload): Promise<Project> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: payload.user_id,
        title: payload.title,
        template_slug: payload.template_slug,
        status: "draft",
        draft_data: payload.draft_data,
        last_opened_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  }

  /**
   * Retrieves a single project by its ID.
   * Returns null if not found or access is denied by RLS.
   */
  static async getProject(projectId: string): Promise<Project | null> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .is("deleted_at", null)
      .single();

    if (error) {
      // PostgREST returns PGRST116 when no row matches (not a fatal error)
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Project;
  }

  /**
   * Retrieves the most recent non-deleted draft project for a given user
   * and template slug. Returns null if no draft exists yet.
   *
   * Used by useProject() to determine whether to load or create a project.
   */
  static async getLatestDraftForTemplate(
    userId: string,
    templateSlug: string
  ): Promise<Project | null> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .eq("template_slug", templateSlug)
      .eq("status", "draft")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as Project | null;
  }

  /**
   * Retrieves all non-deleted projects for the authenticated user.
   * Ordered by last_opened_at descending (most recently touched first).
   */
  static async getProjects(userId: string): Promise<Project[]> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("last_opened_at", { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data ?? []) as Project[];
  }

  /**
   * Updates a project's mutable fields (draft_data, title, last_opened_at).
   * Supabase trigger automatically updates `updated_at`.
   *
   * @throws If the update fails (RLS violation, network error, etc.)
   */
  static async updateProject(
    projectId: string,
    payload: UpdateProjectPayload
  ): Promise<Project> {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  }

  /**
   * Soft-deletes a project by setting deleted_at to the current timestamp.
   * The row is retained in the database for potential recovery.
   *
   * RLS: Only the owning user can delete their own project.
   */
  static async deleteProject(projectId: string): Promise<void> {
    const supabase = getClient();

    const { error } = await supabase
      .from("projects")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", projectId);

    if (error) throw error;
  }

  /**
   * Duplicates an existing project, creating a new row with the same
   * template_slug and draft_data but a modified title (appended with " (Copy)").
   *
   * @throws If the source project is not found or the insert fails.
   */
  static async duplicateProject(projectId: string, userId: string): Promise<Project> {
    const source = await ProjectService.getProject(projectId);
    if (!source) throw new Error(`Project ${projectId} not found.`);

    return ProjectService.createProject({
      user_id: userId,
      title: `${source.title} (Copy)`,
      template_slug: source.template_slug,
      draft_data: source.draft_data,
    });
  }

  /**
   * Updates the last_opened_at timestamp for a project.
   * Called when a user navigates to the customize page for an existing draft.
   */
  static async touchProject(projectId: string): Promise<void> {
    const supabase = getClient();

    const { error } = await supabase
      .from("projects")
      .update({ last_opened_at: new Date().toISOString() })
      .eq("id", projectId);

    if (error) throw error;
  }

  /**
   * Marks a project as paid after successful payment verification.
   * Called exclusively from the server-side /api/orders/verify route.
   *
   * Idempotent: if the project is already paid, this is a safe no-op.
   * Uses a service-role client for server contexts.
   *
   * @param supabaseClient - Pass the server-side Supabase client from the API route.
   * @param projectId - The project to mark paid.
   */
  static async markProjectPaid(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabaseClient: any,
    projectId: string
  ): Promise<void> {
    const { error } = await supabaseClient
      .from("projects")
      .update({ status: "paid" })
      .eq("id", projectId)
      .eq("status", "draft"); // Guard: only transition draft → paid, never paid → paid

    if (error) throw error;
  }
}
