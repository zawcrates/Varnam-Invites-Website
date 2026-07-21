/**
 * publish.types.ts
 *
 * Type definitions for the Invitation Publishing Engine (Sprint 5).
 */

export interface PublishedInvitation {
  id: string;
  project_id: string;
  slug: string;
  is_active: boolean;
  published_version: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload returned by the secure get_public_invitation RPC.
 * Only exposes minimal data required to render the wedding invitation,
 * ensuring public visitors cannot see internal IDs or timestamps.
 */
export interface PublicInvitationPayload {
  template_slug: string;
  draft_data: Record<string, unknown>;
}
