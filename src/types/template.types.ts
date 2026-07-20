/**
 * template.types.ts
 *
 * Canonical type definitions for the Template domain.
 *
 * These interfaces mirror what is stored in the Supabase `templates` table
 * and are the single source of truth for template shape across the entire
 * application — services, hooks, components, and pages all import from here.
 *
 * NOTE: The data/templates.ts file still holds the static TEMPLATES array and
 * its own local interface definitions. During Sprint 1, both coexist.
 * In Sprint 3 (Database Redesign) the static array will be replaced by
 * TemplateService.getAll() and data/templates.ts will be retired.
 */

// ---------------------------------------------------------------------------
// EventItem
// ---------------------------------------------------------------------------

/**
 * A single wedding event (e.g. Sangeet, Wedding Ceremony, Reception).
 * Stored as a JSON array inside InviteData.
 */
export interface EventItem {
  /** Unique identifier for the event (UUID or sequential string). */
  id: string;
  /** Display title, e.g. "Haldi Ceremony". */
  title: string;
  /** Human-readable date string, e.g. "Saturday, 22 Nov 2025". */
  date: string;
  /** Human-readable time string, e.g. "11:00 AM". */
  time: string;
  /** Venue name or address string. */
  location: string;
}

// ---------------------------------------------------------------------------
// InviteData
// ---------------------------------------------------------------------------

/**
 * All personalizable fields for a wedding invitation.
 * Stored as JSONB in the `invitations.invite_data` column.
 * Also used as the `defaultData` inside a Template record.
 */
export interface InviteData {
  /** Whether to show the animated preloader screen on load. */
  showPreloader: boolean;
  /** Duration multiplier for the preloader animation. */
  preloaderTime: number;
  /** Groom's display name. */
  groomName: string;
  /** Connector word between names, e.g. "Weds" or "&". */
  connector: string;
  /** Bride's display name. */
  brideName: string;
  /** Tagline at the top of the invite parchment, e.g. "TOGETHER WITH THEIR FAMILIES". */
  welcomeTop: string;
  /** Separator word between names, typically "AND". */
  andText: string;
  /** First line of the invitation body text. */
  inviteText1: string;
  /** Second line of the invitation body text. */
  inviteText2: string;
  /** Wedding month in uppercase, e.g. "NOVEMBER". */
  month: string;
  /** Formatted date display string, e.g. "SUNDAY | 23 | 2025". */
  dateDetails: string;
  /** Ceremony time display string, e.g. "7:45 AM – 8:45 AM". */
  time: string;
  /** Venue name / first line. */
  locationLine1: string;
  /** Venue address / second line. */
  locationLine2: string;
  /** Google Maps embed URL for the venue iframe. */
  mapEmbedUrl: string;
  /** "Our Story" paragraph text displayed on the invitation. */
  storyText: string;
  /** WhatsApp number for RSVP (digits only, no country code). */
  whatsappNumber: string;
  /** Path or URL to the background audio file. */
  audioSrc: string;
  /** Optional list of wedding events. Rendered as a scrollable event card carousel. */
  events?: EventItem[];
}

// ---------------------------------------------------------------------------
// Template Category
// ---------------------------------------------------------------------------

/** Union type of all supported template visual categories. */
export type TemplateCategory = "Vintage" | "Modern" | "Traditional" | "Floral";

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

/**
 * A wedding invitation template product.
 * Corresponds to a row in the `public.templates` Supabase table.
 */
export interface Template {
  /** Unique identifier (UUID from Supabase, or stable string ID for static data). */
  id: string;
  /** URL-safe slug, e.g. "vintage-parchment". Used for routing: /templates/[slug]. */
  slug: string;
  /** Marketing display name, e.g. "Vintage Parchment Scroll". */
  name: string;
  /** Sale price in INR (paise not used — stored as whole rupees). */
  price: number;
  /** Original / crossed-out price for displaying discounts. */
  originalPrice: number;
  /** Star rating out of 5, e.g. 4.9. */
  rating: number;
  /** Number of reviews, used for social proof display. */
  reviewsCount: number;
  /** Visual style category. */
  category: TemplateCategory;
  /** Short marketing description shown on template cards. */
  description: string;
  /** Path to the template card thumbnail image. */
  thumbnail: string;
  /** Bullet-point feature list shown on the template detail page. */
  features: string[];
  /**
   * Default data pre-populating the customizer for demo purposes.
   * This is the sample invite shown when a user first opens the template.
   */
  defaultData: InviteData;
}
