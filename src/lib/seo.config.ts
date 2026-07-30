import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://varnaminvites.com";

export const BRAND = {
  name: "Varnam Invites",
  tagline: "Premium Digital Wedding Invitations & Website Maker",
  description:
    "Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, Google Maps venue location, and event timelines.",
  keywords: [
    "Varnam Invites",
    "Digital Wedding Invitations",
    "Wedding Invitation Maker",
    "Online Wedding Invitations",
    "Indian Wedding Invitations",
    "Tamil Wedding Invitations",
    "Telugu Wedding Invitations",
    "Hindu Wedding Invitations",
    "Muslim Wedding Invitations",
    "Christian Wedding Invitations",
    "Luxury Wedding Invitations",
    "Custom Wedding Website",
    "Digital Marriage Card",
  ],
  ogImage: `${SITE_URL}/og-banner.png`,
  logoUrl: `${SITE_URL}/logo.png`,
  contactEmail: "varnaminvites@gmail.com",
  social: {
    whatsapp: "https://wa.me/916379237294",
    instagram: "https://instagram.com/varnaminvites",
  },
};

/**
 * Builds clean canonical URL string from relative path.
 */
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Common default metadata generator for public pages.
 */
export function constructMetadata({
  title,
  description = BRAND.description,
  path = "",
  keywords = BRAND.keywords,
  image = BRAND.ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title
    ? `${title} | Varnam Invites`
    : `${BRAND.name} | ${BRAND.tagline}`;
  const canonical = getCanonicalUrl(path);

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: BRAND.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${BRAND.name} - ${title || BRAND.tagline}`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@varnaminvites",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
  };
}
