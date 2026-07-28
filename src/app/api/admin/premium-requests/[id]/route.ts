/**
 * PATCH /api/admin/premium-requests/[id]
 *
 * Updates the custom_artwork_status for a project.
 * Admin-only — protected by Supabase auth check.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PremiumArtworkStatus } from "@/types";

const VALID_STATUSES: PremiumArtworkStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "delivered",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { status, custom_artwork_requested } = body as {
      status?: PremiumArtworkStatus;
      custom_artwork_requested?: boolean;
    };

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (status !== undefined) updatePayload.custom_artwork_status = status;
    if (custom_artwork_requested !== undefined)
      updatePayload.custom_artwork_requested = custom_artwork_requested;

    const { error } = await supabase
      .from("projects")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, status });
  } catch (err: unknown) {
    console.error("[/api/admin/premium-requests/[id]] Error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
