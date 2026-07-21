/**
 * src/features/seo/metadata.ts
 *
 * Exposes metadata builders and JSON-LD schema generation helpers
 * for standard marketing pages and dynamic invitations.
 */

import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://varnaminvites.com";

// ---------------------------------------------------------------------------
// Standard Metadata Builders
// ---------------------------------------------------------------------------

export interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

/**
 * Builds clean metadata with OpenGraph and Twitter cards, adding proper defaults.
 */
export function buildPageMetadata(options: MetadataOptions): Metadata {
  const { title, description, path = "", image = "/Varnam_svg3.png", noindex = false } = options;
  const canonicalUrl = `${SITE_URL}${path}`;

  const meta: Metadata = {
    title: `${title} | Varnam Invites`,
    description,
    keywords: ["wedding invitation", "digital card", "wedding website", "online invitation", "indian wedding", "customizable wedding card"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Varnam Invites",
      images: [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
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
      images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
    },
  };

  if (noindex) {
    meta.robots = {
      index: false,
      follow: false,
      nocache: true,
    };
  }

  return meta;
}

// ---------------------------------------------------------------------------
// Structured Data (JSON-LD) Schemas
// ---------------------------------------------------------------------------

/**
 * Generates Organization structured data schema.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Varnam Invites",
    "url": SITE_URL,
    "logo": `${SITE_URL}/Varnam_svg3.png`,
    "sameAs": [
      "https://facebook.com/varnaminvites",
      "https://instagram.com/varnaminvites",
      "https://twitter.com/varnaminvites"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 98765 43210",
      "contactType": "customer service",
      "email": "support@varnaminvites.com"
    }
  };
}

/**
 * Generates Website structured data schema.
 */
export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Varnam Invites",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/templates?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export interface EventSchemaOptions {
  groomName: string;
  brideName: string;
  dateStr?: string;
  locationLine1?: string;
  locationLine2?: string;
  slug: string;
}

/**
 * Generates Event structured data schema with appropriate person and location mappings.
 */
export function buildEventSchema(options: EventSchemaOptions) {
  const { groomName, brideName, dateStr, locationLine1, locationLine2, slug } = options;
  const groom = groomName || "Groom";
  const bride = brideName || "Bride";
  const invitationUrl = `${SITE_URL}/invite/${slug}`;

  // Try to parse ISO date, otherwise default to 6 months from now
  let isoDate = dateStr;
  if (!isoDate) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    isoDate = futureDate.toISOString();
  }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${groom} and ${bride}'s Wedding`,
    "startDate": isoDate,
    "url": invitationUrl,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": locationLine1 || "Wedding Venue",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": locationLine2 || "Venue Details",
        "addressLocality": "India",
        "addressCountry": "IN"
      }
    },
    "organizer": {
      "@type": "Person",
      "name": `${groom} & ${bride}`
    }
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Generates BreadcrumbList structured data schema.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.item}`
    }))
  };
}
