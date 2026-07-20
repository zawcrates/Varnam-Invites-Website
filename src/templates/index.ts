/**
 * src/templates/index.ts
 *
 * THE TEMPLATE REGISTRY
 *
 * This is the most important file in the entire template system.
 * Every part of the application that needs to know about a template
 * renderer — routing, preview, customizer, invitation publishing —
 * MUST go through this registry.
 *
 * Rules:
 *   1. Every template renderer is registered here. Never imported directly.
 *   2. The registry key MUST match the `slug` field in the TEMPLATES data array.
 *   3. Renderers live in their own folder under src/templates/[slug]/.
 *   4. When adding a new template, add it here and nowhere else.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  HOW TO ADD A NEW TEMPLATE                                          │
 * │                                                                     │
 * │  1. Create src/templates/my-new-template/                           │
 * │  2. Build your renderer component inside that folder.               │
 * │  3. Import and register it below:                                   │
 * │       import MyNewTemplate from "./my-new-template/MyNewTemplate";  │
 * │       "my-new-template": MyNewTemplate,                             │
 * │  4. Add the metadata to src/data/templates.ts with the same slug.  │
 * │  Done. No other file changes required.                              │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Current Sprint 1 state:
 *   Both templates still live in src/components/templates/ (not yet migrated).
 *   The registry currently re-exports from that location.
 *   In Phase C/D, we migrate renderers to src/templates/ one at a time.
 *
 * Sprint status of each renderer:
 *   vintage-parchment  → Phase C (migrated this sprint)
 *   royal-heritage     → Phase D (migrated this sprint)
 */

"use client";

import React, { ComponentType } from "react";
import type { InviteData } from "@/types";

// ---------------------------------------------------------------------------
// Renderer interface
// ---------------------------------------------------------------------------

/** Every template renderer must accept this prop shape. */
export interface TemplateRendererProps {
  inviteData: Partial<InviteData>;
}

// ---------------------------------------------------------------------------
// Template imports
// ---------------------------------------------------------------------------
// As templates are migrated to src/templates/, update the import paths below.
// The registry key stays the same — only the import path changes.

import VintageParchmentTemplate from "./vintage-parchment/VintageParchmentTemplate";
import RoyalHeritageTemplate from "./royal-heritage/RoyalHeritageTemplate";

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * The Template Registry.
 * Maps template slugs to their React renderer components.
 *
 * Typed as a readonly record to prevent accidental runtime mutation.
 */
export const TemplateRegistry: Readonly<
  Record<string, ComponentType<TemplateRendererProps>>
> = {
  "vintage-parchment": VintageParchmentTemplate,
  "royal-heritage": RoyalHeritageTemplate,
} as const;

// ---------------------------------------------------------------------------
// Registry lookup helper
// ---------------------------------------------------------------------------

/**
 * Retrieves a template renderer by slug.
 * Returns `null` if no renderer is registered for that slug.
 *
 * This is the ONLY function pages should use to get a renderer.
 * Never access TemplateRegistry[slug] directly in page code.
 *
 * @example
 *   const Renderer = getTemplateRenderer("vintage-parchment");
 *   if (!Renderer) return <NotFound />;
 *   return <Renderer inviteData={data} />;
 */
export function getTemplateRenderer(
  slug: string
): ComponentType<TemplateRendererProps> | null {
  return TemplateRegistry[slug] ?? null;
}

/**
 * Returns all registered template slugs.
 * Used by Next.js `generateStaticParams` to pre-render invitation pages.
 */
export function getRegisteredSlugs(): string[] {
  return Object.keys(TemplateRegistry);
}
