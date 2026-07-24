/**
 * PublishService.ts
 *
 * Core service layer encapsulating all publishing logic for wedding invitations.
 * Runs on both server routes (using direct database connection/service roles)
 * and client contexts.
 *
 * Design features:
 *   - Clean deterministic slug generation with fallback collision suffixes.
 *   - Idempotency checks to prevent duplicate publication records.
 *   - Exposes public rendering checks (returns only template_slug and draft_data).
 */

import { createClient } from "@/lib/supabase/browser";
import { cleanSlug } from "@/features/publishing";
import { validateProjectForPublishing } from "@/validations/publish.validation";
import type { PublishedInvitation, PublicInvitationPayload } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";


function getClient() {
  return createClient();
}

export class PublishService {
  /**
   * Generates a deterministic slug from the groom and bride names.
   * If the slug is already taken, appends a short random hexadecimal suffix.
   *
   * @param supabaseClient - Supabase client instance (server or browser).
   * @param groomName - Groom's name.
   * @param brideName - Bride's name.
   */
  static async generateUniqueSlug(
    supabaseClient: SupabaseClient,
    groomName: string,
    brideName: string
  ): Promise<string> {
    const groomClean = groomName ? groomName.split(" ")[0] : "groom";
    const brideClean = brideName ? brideName.split(" ")[0] : "bride";
    const baseSlug = cleanSlug(`${groomClean}-${brideClean}`);

    // Test availability of the base slug
    const { data: exactMatch } = await supabaseClient
      .from("published_invitations")
      .select("id")
      .eq("slug", baseSlug)
      .maybeSingle();

    if (!exactMatch) {
      return baseSlug;
    }

    // Slug collision: generate a random suffix
    let attempts = 0;
    while (attempts < 5) {
      const suffix = Math.floor(Math.random() * 65535).toString(16).padStart(4, "0");
      const candidateSlug = `${baseSlug}-${suffix}`;

      const { data: collision } = await supabaseClient
        .from("published_invitations")
        .select("id")
        .eq("slug", candidateSlug)
        .maybeSingle();

      if (!collision) {
        return candidateSlug;
      }
      attempts++;
    }

    // Fallback: use timestamp if multiple collisions occur
    return `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  /**
   * Idempotently publishes a paid project.
   * If the project is already published, returns the existing record instead of throwing.
   *
   * Called primarily in the server context post-payment verification.
   *
   * @param supabaseClient - Pass the active Supabase client (e.g. server role client).
   * @param projectId - The project to publish.
   */
  static async publishProject(
    supabaseClient: SupabaseClient,
    projectId: string
  ): Promise<PublishedInvitation> {
    // 1. Idempotency Check: Already published?
    const { data: existing } = await supabaseClient
      .from("published_invitations")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (existing) {
      return existing as PublishedInvitation;
    }

    // 2. Fetch project details
    const { data: project, error: projectError } = await supabaseClient
      .from("projects")
      .select("user_id, status, draft_data")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      throw new Error("Project not found.");
    }

    // 3. Validate eligibility
    const validation = validateProjectForPublishing(project, project.user_id);
    if (!validation.isValid) {
      throw new Error(validation.message || "Project is not eligible for publishing.");
    }

    // 4. Generate slug from draft details
    const groomName = project.draft_data?.groomName || "";
    const brideName = project.draft_data?.brideName || "";
    const slug = await this.generateUniqueSlug(supabaseClient, groomName, brideName);

    // 5. Insert publication record
    const { data: newPub, error: insertError } = await supabaseClient
      .from("published_invitations")
      .insert({
        project_id: projectId,
        slug: slug,
        is_active: true,
        published_version: 1,
        published_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError || !newPub) {
      console.error("[PublishService.publishProject] Insert failed:", insertError);
      throw new Error("Failed to create publication record.");
    }

    return newPub as PublishedInvitation;
  }

  /**
   * Retrieves a published invitation record by project ID.
   * Used on the client to check if a project has been published.
   */
  static async getPublishedInvitationByProject(projectId: string): Promise<PublishedInvitation | null> {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("published_invitations")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as PublishedInvitation | null;
  }

  /**
   * Retrieves the secure rendering payload for a public invitation.
   * Evaluated via the database secure RPC function.
   *
   * @param slug - The unique invitation slug.
   */
  static async getPublicInvitation(slug: string): Promise<PublicInvitationPayload | null> {
    const supabase = getClient();

    // 1. Try RPC function call
    try {
      const { data, error } = await supabase.rpc("get_public_invitation", { p_slug: slug });
      if (!error && data && data.length > 0) {
        return data[0] as PublicInvitationPayload;
      }
    } catch (e) {
      console.warn("[PublishService.getPublicInvitation] RPC call failed, trying direct query:", e);
    }

    // 2. Direct database query fallback
    try {
      const { data: pub, error: pubError } = await supabase
        .from("published_invitations")
        .select("slug, is_active, published_version, published_at, projects!inner(template_slug, draft_data)")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (pubError || !pub || !pub.projects) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const proj = (Array.isArray(pub.projects) ? pub.projects[0] : pub.projects) as any;

      return {
        slug: pub.slug,
        template_slug: proj.template_slug,
        draft_data: proj.draft_data,
        published_version: pub.published_version,
        published_at: pub.published_at,
      } as PublicInvitationPayload;
    } catch (err) {
      console.error("[PublishService.getPublicInvitation] Direct query error:", err);
      return null;
    }
  }
}
