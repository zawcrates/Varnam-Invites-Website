/**
 * src/app/invite/[slug]/page.tsx
 *
 * Public unauthenticated route for viewing published wedding invitations.
 *
 * Flow:
 *   1. Read slug parameter.
 *   2. Fetch target invitation via secure RPC (get_public_invitation).
 *   3. If not found or inactive, trigger 404 notFound().
 *   4. Resolve template component from TemplateRegistry.
 *   5. Render client component template with the saved draft_data and JSON-LD schema.
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublishService } from "@/services/PublishService";
import { getTemplateRenderer } from "@/templates";
import type { InviteData } from "@/data/templates";
import { buildEventSchema } from "@/features/seo/metadata";
import { TEMPLATES } from "@/data/templates";

export const revalidate = 3600; // ISR cache policy: revalidate pages every hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Dynamic SEO Metadata Generation
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch public invitation payload securely
  const invitationPayload = await PublishService.getPublicInvitation(slug);

  if (!invitationPayload || !invitationPayload.template_slug || !invitationPayload.draft_data) {
    return {
      title: "Invitation Not Found | Varnam Invites",
      description: "The requested digital wedding invitation could not be found.",
      robots: { index: false },
    };
  }

  const data = invitationPayload.draft_data as Partial<InviteData>;
  const groom = data.groomName?.trim();
  const bride = data.brideName?.trim();

  // Robust fallbacks to prevent empty titles (e.g. "❤️ | Wedding Invitation")
  const groomText = groom || "Groom";
  const brideText = bride || "Bride";
  
  let title = "Wedding Invitation | Varnam Invites";
  if (groom && bride) {
    title = `${groomText} ❤️ ${brideText} | Wedding Invitation`;
  } else if (groom || bride) {
    title = `${groomText || brideText} Wedding Celebration`;
  }

  const description = `You are warmly invited to join and celebrate the wedding festivities of ${groomText} and ${brideText}. Read details for ceremony time and venue locations.`;

  // Find template preview image
  const templateObj = TEMPLATES.find((t) => t.slug === invitationPayload.template_slug);
  const ogImage = templateObj?.thumbnail || "/Varnam_svg3.png";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://varnaminvites.com";
  const canonicalUrl = `${siteUrl}/invite/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`],
    },
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function PublicInvitationPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch public invitation payload securely
  const invitationPayload = await PublishService.getPublicInvitation(slug);

  // 2. Validate: Must exist and contain configuration
  if (!invitationPayload || !invitationPayload.template_slug || !invitationPayload.draft_data) {
    return notFound();
  }

  // 3. Resolve the template renderer from the central TemplateRegistry
  const Renderer = getTemplateRenderer(invitationPayload.template_slug);

  if (!Renderer) {
    console.error(`[PublicInvitationPage] Registered template renderer not found for slug: ${invitationPayload.template_slug}`);
    return notFound();
  }

  const inviteDataCast = invitationPayload.draft_data as Partial<InviteData>;
  const groom = inviteDataCast.groomName || "";
  const bride = inviteDataCast.brideName || "";

  // 4. Generate dynamic Event schema (JSON-LD) for search indexing
  const eventSchema = buildEventSchema({
    groomName: groom,
    brideName: bride,
    dateStr: undefined, // Add specific ISO date mapping if parsed from dateDetails later
    locationLine1: inviteDataCast.locationLine1,
    locationLine2: inviteDataCast.locationLine2,
    slug,
  });

  return (
    <>
      {/* Inject JSON-LD Event schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      
      {/* Render template renderer with active customizations */}
      <Renderer inviteData={inviteDataCast} />
    </>
  );
}
