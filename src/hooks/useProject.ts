"use client";

/**
 * useProject.ts
 *
 * Custom hook managing the Project & Draft Engine lifecycle for the customize page.
 *
 * Responsibilities:
 *   1. On mount: Load the latest server draft for this user + template slug.
 *      If none exists, remain in a "no project yet" state.
 *      If found, update last_opened_at and populate local form state.
 *
 *   2. On first meaningful edit (isDirty transitions false → true):
 *      Automatically create a project in Supabase.
 *
 *   3. On subsequent edits:
 *      Write to localStorage immediately (offline cache).
 *      Schedule a debounced save to Supabase (1.5s after last keystroke).
 *
 *   4. On network failure:
 *      Continue storing edits in localStorage.
 *      Track connectionStatus = 'offline'.
 *      Listen for window 'online' event; when fired, sync immediately.
 *
 *   5. On refresh (page reload):
 *      Attempt to load latest server state first.
 *      If offline, fall back to localStorage.
 *
 *   6. On auth state change (guest signs in):
 *      Detect session and upload local draft to Supabase.
 *
 * Architecture:
 *   Component → useProject() → ProjectService → Supabase
 *
 * Usage:
 *   const { formData, updateFormData, saveStatus, connectionStatus } = useProject(slug, template);
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProjectService } from "@/services/ProjectService";
import { generateProjectTitle } from "@/validations/project.validation";
import type { InviteData, Template } from "@/types";
import type {
  Project,
  SaveStatus,
  ConnectionStatus,
  UseProjectState,
} from "@/types/project.types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Debounce delay (ms) after last keystroke before saving to Supabase. */
const AUTOSAVE_DEBOUNCE_MS = 1500;

/** localStorage key for caching the form data for a given slug. */
function localKey(slug: string) {
  return `varnam_custom_${slug}`;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProject(
  slug: string,
  template: Template
): UseProjectState {
  const { user } = useAuth();

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  /** The current project record, null before first edit or when loading. */
  const [project, setProject] = useState<Project | null>(null);

  /** The live editable form data. */
  const [formData, setFormData] = useState<InviteData>(template.defaultData);

  /** Whether the initial server load is in progress. */
  const [loading, setLoading] = useState(true);

  /** Whether the user has made at least one meaningful edit this session. */
  const [isDirty, setIsDirty] = useState(false);

  /** Supabase persistence status. */
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  /** Browser network connectivity. */
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "online"
  );

  // -------------------------------------------------------------------------
  // Refs (avoid stale closures in debounce)
  // -------------------------------------------------------------------------

  const projectRef = useRef<Project | null>(null);
  const formDataRef = useRef<InviteData>(template.defaultData);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { projectRef.current = project; }, [project]);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  // -------------------------------------------------------------------------
  // Network connectivity listeners
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus("online");
      // Sync queued offline edits immediately when network comes back
      syncToSupabase(formDataRef.current);
    };

    const handleOffline = () => {
      setConnectionStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Core Save Logic
  // -------------------------------------------------------------------------

  /**
   * Persists the current formData to Supabase.
   * Handles both create (first edit) and update (subsequent edits).
   * This is the only function that writes to the database.
   */
  const syncToSupabase = useCallback(
    async (data: InviteData) => {
      if (!user) return; // Guest: localStorage-only, no Supabase writes
      if (isSavingRef.current) return; // Already a save in-flight

      isSavingRef.current = true;
      setSaveStatus("saving");

      try {
        const existingProject = projectRef.current;

        if (!existingProject) {
          // First meaningful edit: create the project
          const title = generateProjectTitle(
            slug,
            data.groomName,
            data.brideName
          );
          const created = await ProjectService.createProject({
            user_id: user.id,
            title,
            template_slug: slug,
            draft_data: data,
          });
          setProject(created);
          projectRef.current = created;
        } else {
          // Subsequent edits: update existing draft
          const updated = await ProjectService.updateProject(existingProject.id, {
            draft_data: data,
          });
          setProject(updated);
          projectRef.current = updated;
        }

        // Mirror into localStorage as the authoritative offline cache
        localStorage.setItem(localKey(slug), JSON.stringify(data));
        setSaveStatus("saved");
      } catch (err) {
        console.error("[useProject] Save failed:", err);
        setSaveStatus("error");
        setConnectionStatus("offline");
      } finally {
        isSavingRef.current = false;
      }
    },
    [user, slug]
  );

  // -------------------------------------------------------------------------
  // Initial Load
  // -------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      setLoading(true);

      if (user) {
        // --- Authenticated user: try loading from Supabase first ---
        try {
          const serverProject = await ProjectService.getLatestDraftForTemplate(
            user.id,
            slug
          );

          if (cancelled) return;

          if (serverProject) {
            // Resume server draft
            setProject(serverProject);
            projectRef.current = serverProject;
            setFormData(serverProject.draft_data);
            formDataRef.current = serverProject.draft_data;

            // Mirror latest server state into localStorage
            localStorage.setItem(
              localKey(slug),
              JSON.stringify(serverProject.draft_data)
            );

            // Update last_opened_at in background (non-blocking)
            ProjectService.touchProject(serverProject.id).catch(console.error);

            setSaveStatus("saved");
          } else {
            // No server draft: load localStorage if available, else use defaults
            const cached = localStorage.getItem(localKey(slug));
            if (cached) {
              try {
                const parsed = JSON.parse(cached) as InviteData;
                // Ensure events field is present
                if (!parsed.events && template.defaultData.events) {
                  parsed.events = template.defaultData.events;
                }
                setFormData(parsed);
                formDataRef.current = parsed;
              } catch {
                // Corrupt cache: silently fall back to defaults
              }
            }
          }
        } catch (err) {
          if (cancelled) return;

          // Network failure: fall back to localStorage
          console.warn("[useProject] Could not load server draft, using localStorage:", err);
          setConnectionStatus("offline");
          const cached = localStorage.getItem(localKey(slug));
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as InviteData;
              if (!parsed.events && template.defaultData.events) {
                parsed.events = template.defaultData.events;
              }
              setFormData(parsed);
              formDataRef.current = parsed;
            } catch {
              // Corrupt cache: fall back to defaults
            }
          }
        }
      } else {
        // --- Guest user: localStorage only ---
        const cached = localStorage.getItem(localKey(slug));
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as InviteData;
            if (!parsed.events && template.defaultData.events) {
              parsed.events = template.defaultData.events;
            }
            setFormData(parsed);
            formDataRef.current = parsed;
          } catch {
            // Corrupt cache: fall back to defaults
          }
        }
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    loadInitialData();

    return () => { cancelled = true; };
    // Re-run when user auth state changes (guest → signed in)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, slug]);

  // -------------------------------------------------------------------------
  // updateFormData – called by component on every user edit
  // -------------------------------------------------------------------------

  /**
   * Updates local form state, writes to localStorage immediately,
   * and schedules a debounced save to Supabase.
   */
  const updateFormData = useCallback(
    (data: InviteData) => {
      setFormData(data);
      formDataRef.current = data;

      // Mark as dirty on first edit
      if (!isDirty) {
        setIsDirty(true);
      }

      // Write to localStorage immediately (offline-safe, instant)
      localStorage.setItem(localKey(slug), JSON.stringify(data));

      // Debounced cloud save
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        syncToSupabase(data);
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    [isDirty, slug, syncToSupabase]
  );

  // -------------------------------------------------------------------------
  // saveNow – manual immediate save (bypasses debounce)
  // -------------------------------------------------------------------------

  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    await syncToSupabase(formDataRef.current);
  }, [syncToSupabase]);

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    project,
    formData,
    loading,
    isDirty,
    saveStatus,
    connectionStatus,
    saveNow,
    updateFormData,
  };
}
