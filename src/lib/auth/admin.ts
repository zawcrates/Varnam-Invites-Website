/**
 * admin.ts
 *
 * Production-grade Server-side Authentication & Authorization utilities.
 * Handles admin privilege verification against the `public.admins` database table.
 */

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * Returns the currently authenticated user from the Supabase session, or null.
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Checks whether a given user ID exists in the `public.admins` database table.
 * Does NOT rely on hardcoded email strings in code.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Admin check database error:", error.message);
      return false;
    }

    return Boolean(data);
  } catch (e) {
    console.error("Admin authorization error:", e);
    return false;
  }
}

/**
 * Enforces admin authorization in Next.js Server Components / Pages.
 * Redirects unauthorized users server-side before page rendering.
 *
 * - No Session  -> Redirects to homepage with login modal open.
 * - Non-Admin   -> Redirects to /forbidden (403 Access Denied page).
 */
export async function requireAdmin(redirectPath = "/admin") {
  const user = await getCurrentUser();

  if (!user) {
    const loginUrl = `/?login=true&redirect=${encodeURIComponent(redirectPath)}`;
    redirect(loginUrl);
  }

  const isUserAdmin = await isAdmin(user.id);
  if (!isUserAdmin) {
    redirect("/forbidden");
  }

  return { user };
}

/**
 * Enforces admin authorization in API routes (/api/admin/*).
 * Returns JSON 401 Unauthorized or 403 Forbidden responses.
 */
export async function requireAdminApi() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Active user session required" },
        { status: 401 }
      ),
    };
  }

  const isUserAdmin = await isAdmin(user.id);
  if (!isUserAdmin) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Forbidden: Admin privileges required" },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}
