"use client";

/**
 * usePublish.ts
 *
 * Custom React hook for checking and managing the publication status of a project.
 */

import { useState, useEffect, useCallback } from "react";
import { PublishService } from "@/services/PublishService";
import { buildPublicInvitationUrl } from "@/features/publishing";
import type { PublishedInvitation } from "@/types";

export interface UsePublishState {
  invitation: PublishedInvitation | null;
  publicUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function usePublish(projectId: string | null) {
  const [state, setState] = useState<UsePublishState>({
    invitation: null,
    publicUrl: null,
    loading: true,
    error: null,
  });

  const checkPublicationStatus = useCallback(async () => {
    if (!projectId) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const record = await PublishService.getPublishedInvitationByProject(projectId);
      if (record) {
        setState({
          invitation: record,
          publicUrl: buildPublicInvitationUrl(record.slug),
          loading: false,
          error: null,
        });
      } else {
        setState({
          invitation: null,
          publicUrl: null,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load publication status.";
      setState({
        invitation: null,
        publicUrl: null,
        loading: false,
        error: msg,
      });
    }
  }, [projectId]);

  useEffect(() => {
    checkPublicationStatus();
  }, [checkPublicationStatus]);

  return {
    ...state,
    refetch: checkPublicationStatus,
  };
}
