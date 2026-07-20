/**
 * src/hooks/index.ts
 *
 * Barrel export for all custom React hooks.
 *
 * Usage:
 *   import { useLocalStorage, useAuth } from "@/hooks";
 *
 * Sprint roadmap:
 *   Sprint 2  → useAuth fully wired to Supabase
 *   Sprint 3  → useInvitations, useProject
 *   Sprint 5  → useDashboard
 */

export { useLocalStorage } from "./useLocalStorage";
export { useAuth } from "./useAuth";
