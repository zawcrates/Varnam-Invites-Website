/**
 * project.types.ts
 *
 * Domain types for the Project entity.
 *
 * A Project represents a customer's wedding website throughout its lifecycle.
 * Everything in the platform — payments, publishing, dashboard items — will
 * eventually reference a Project.
 *
 * Sprint 3: Only 'draft' status is supported.
 * Sprint 5+: 'paid', 'published', 'archived' will be added here.
 *
 * Usage:
 *   import type { Project, ProjectStatus, SaveStatus, ConnectionStatus } from "@/types";
 */

import type { InviteData } from "./template.types";

// ---------------------------------------------------------------------------
// Project Lifecycle Status
// ---------------------------------------------------------------------------

/**
 * The current lifecycle status of a project.
 * Only 'draft' is supported in Sprint 3.
 */
export type ProjectStatus = "draft";

// ---------------------------------------------------------------------------
// Sync Status (two separate concerns)
// ---------------------------------------------------------------------------

/**
 * Tracks whether the latest local state has been persisted to Supabase.
 *
 * idle    → no save has been attempted yet (e.g. no edits made)
 * saving  → a debounced save request is in-flight
 * saved   → the last save succeeded; Supabase is up to date
 * error   → the last save failed (network or API error)
 */
export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Tracks the browser's network connectivity.
 *
 * online  → navigator.onLine is true
 * offline → navigator.onLine is false; saves will be queued locally
 */
export type ConnectionStatus = "online" | "offline";

export type PremiumArtworkStatus = "pending" | "in_progress" | "completed" | "delivered";

// ---------------------------------------------------------------------------
// Project Entity
// ---------------------------------------------------------------------------

/**
 * Full project record as returned from Supabase.
 * Mirrors the `projects` database table exactly.
 */
export interface Project {
  id: string;
  user_id: string;
  title: string;
  template_slug: string;
  status: ProjectStatus;
  draft_data: InviteData;
  custom_artwork_requested?: boolean | null;
  custom_artwork_status?: PremiumArtworkStatus | null;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ---------------------------------------------------------------------------
// Service Operation Types
// ---------------------------------------------------------------------------

/**
 * Payload for creating a new project.
 * `id`, `created_at`, `updated_at`, and `deleted_at` are DB-generated.
 */
export interface CreateProjectPayload {
  user_id: string;
  title: string;
  template_slug: string;
  draft_data: InviteData;
}

/**
 * Payload for updating a project's draft data.
 * Only mutable fields are allowed here.
 */
export interface UpdateProjectPayload {
  title?: string;
  draft_data?: InviteData;
  last_opened_at?: string;
}

// ---------------------------------------------------------------------------
// Hook State
// ---------------------------------------------------------------------------

/**
 * Shape of the state exposed by the useProject() hook.
 */
export interface UseProjectState {
  /** The current project record, or null if no project exists yet. */
  project: Project | null;

  /** The live form data being edited. Starts from server or localStorage. */
  formData: InviteData;

  /** Whether the initial project load is in progress. */
  loading: boolean;

  /** Whether the current user has made at least one meaningful edit. */
  isDirty: boolean;

  /** Supabase save status for the latest draft. */
  saveStatus: SaveStatus;

  /** Browser network connectivity status. */
  connectionStatus: ConnectionStatus;

  /** Trigger a manual save immediately (bypasses debounce). */
  saveNow: () => Promise<void>;

  /** Update the form data and schedule a debounced auto-save. */
  updateFormData: (data: InviteData) => void;
}
