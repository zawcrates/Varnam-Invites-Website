export interface InviteData {
  showPreloader: boolean;
  preloaderTime: number;
  groomName: string;
  connector: string;
  brideName: string;
  welcomeTop: string;
  andText: string;
  inviteText1: string;
  inviteText2: string;
  month: string;
  dateDetails: string;
  time: string;
  locationLine1: string;
  locationLine2: string;
  mapEmbedUrl: string;
  storyText: string;
  whatsappNumber: string;
  audioSrc: string;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  category: "Vintage" | "Modern" | "Traditional" | "Floral";
  description: string;
  thumbnail: string;
  features: string[];
  defaultData: InviteData;
}

export const TEMPLATES: Template[] = [
  {
    id: "vintage-parchment-01",
    slug: "vintage-parchment",
    name: "Vintage Parchment Scroll",
    price: 999,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 48,
    category: "Vintage",
    description: "A premium classic invitation showcasing real-time parallax mountain sky scrolling, authentic calligraphy fonts, a torn-paper parchment feel, custom map directions, and background music player.",
    thumbnail: "/cor1.png",
    features: [
      "Smooth Parallax scrolling animation",
      "Traditional calligraphy typography",
      "Embedded Interactive Google Maps",
      "One-click WhatsApp RSVP integration",
      "Background audio player (MP3 auto-play)",
      "Site preloader animation"
    ],
    defaultData: {
      showPreloader: true,
      preloaderTime: 0.7,
      groomName: "Virat Kohli",
      connector: "Weds",
      brideName: "Anushka Sharma",
      welcomeTop: "TOGETHER WITH THEIR FAMILIES",
      andText: "AND",
      inviteText1: "cordially invite you and your family to join the occasion of",
      inviteText2: "their joyous wedding festivities",
      month: "NOVEMBER",
      dateDetails: "SUNDAY | 23 | 2025",
      time: "7:45 AM - 8:45 AM",
      locationLine1: "THE GRAND BALLROOM",
      locationLine2: "123 WEDDING AVENUE, NEW YORK",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "Our journey together began with a simple conversation, and now we are embarking on a lifelong adventure of love and companionship. Join us as we exchange our vows and celebrate the beginning of our forever.",
      whatsappNumber: "1234567890",
      audioSrc: "/bg_music.mp3",
    }
  },
  {
    id: "royal-heritage-02",
    slug: "royal-heritage",
    name: "Royal Rajputana Palace",
    price: 1299,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 32,
    category: "Traditional",
    description: "A majestic traditional Indian invitation featuring deep crimson backgrounds, ornate golden mandalas, and palace arch visuals with sitar ambient music.",
    thumbnail: "/cor2.png",
    features: [
      "Rich golden mandala motifs",
      "Traditional Indian palace artwork",
      "Sitar instrumental background music",
      "Personalized wedding functions timeline",
      "One-click WhatsApp RSVP integration"
    ],
    defaultData: {
      showPreloader: true,
      preloaderTime: 0.7,
      groomName: "Ranveer Singh",
      connector: "Weds",
      brideName: "Deepika Padukone",
      welcomeTop: "WITH THE BLESSINGS OF ALMIGHTY AND ANCESTORS",
      andText: "AND",
      inviteText1: "humbly solicit your gracious presence at the wedding ceremony of",
      inviteText2: "their beloved children",
      month: "DECEMBER",
      dateDetails: "WEDNESDAY | 18 | 2026",
      time: "6:00 PM onwards",
      locationLine1: "THE PALACE PALAZZO",
      locationLine2: "JAIPUR ROAD, RAJASTHAN",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "Two hearts bound by love, celebrating a union of two families. We invite you to bless our union as we take our sacred vows in the royal heritage of Rajasthan.",
      whatsappNumber: "9876543210",
      audioSrc: "/bg_music.mp3"
    }
  },
  {
    id: "floral-elegance-03",
    slug: "vintage-parchment",
    name: "Floral Elegance",
    price: 899,
    originalPrice: 1799,
    rating: 4.7,
    reviewsCount: 18,
    category: "Floral",
    description: "A delicate floral-themed parchment invitation with elegant botanical illustrations and soft, soothing animations.",
    thumbnail: "/canvas 2.png",
    features: [
      "Hand-drawn botanical illustrations",
      "Elegant serif typography",
      "Interactive venue layout map",
      "One-click WhatsApp RSVP link"
    ],
    defaultData: {
      showPreloader: true,
      preloaderTime: 0.7,
      groomName: "Rahul Sharma",
      connector: "Weds",
      brideName: "Priya Patel",
      welcomeTop: "WE INVITE YOU TO CELEBRATE WITH US",
      andText: "AND",
      inviteText1: "invite you to celebrate the marriage of their children",
      inviteText2: "at the wedding reception",
      month: "JANUARY",
      dateDetails: "SATURDAY | 10 | 2026",
      time: "7:00 PM onwards",
      locationLine1: "THE ROSE GARDENS",
      locationLine2: "456 FLORAL LANE, SEATTLE",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "Two lives, two hearts, joined together in friendship and love. Please join us as we begin our new life together.",
      whatsappNumber: "1234567890",
      audioSrc: "/bg_music.mp3"
    }
  },
  {
    id: "modern-minimal-04",
    slug: "royal-heritage",
    name: "Modern Minimalist",
    price: 799,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 22,
    category: "Modern",
    description: "A clean, contemporary invitation with striking asymmetrical layouts and bold modern lettering.",
    thumbnail: "/canvas 3.webp",
    features: [
      "Sleek modern editorial fonts",
      "High-contrast color scheme",
      "Dynamic scrolling animations",
      "One-click WhatsApp RSVP integration"
    ],
    defaultData: {
      showPreloader: true,
      preloaderTime: 0.7,
      groomName: "Kabir Malhotra",
      connector: "Weds",
      brideName: "Nisha Sen",
      welcomeTop: "THE HONOR OF YOUR PRESENCE IS REQUESTED",
      andText: "AND",
      inviteText1: "at the celebration of their union",
      inviteText2: "and wedding ceremony",
      month: "FEBRUARY",
      dateDetails: "FRIDAY | 14 | 2026",
      time: "5:30 PM onwards",
      locationLine1: "THE LUXE GALLERY",
      locationLine2: "789 URBAN WAY, SAN FRANCISCO",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "Our story is our own, but the celebration is for everyone we love. Come toast to our new beginning.",
      whatsappNumber: "9876543210",
      audioSrc: "/bg_music.mp3"
    }
  },
  {
    id: "golden-radiance-05",
    slug: "vintage-parchment",
    name: "Golden Radiance",
    price: 1099,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 15,
    category: "Floral",
    description: "A luxury wedding invitation shimmering with golden dust particles and beautiful traditional calligraphic borders.",
    thumbnail: "/background.webp",
    features: [
      "Golden particles animations",
      "Ornate golden border designs",
      "Classical sitar/flute background music",
      "One-click WhatsApp RSVP link"
    ],
    defaultData: {
      showPreloader: true,
      preloaderTime: 0.7,
      groomName: "Aarav Gupta",
      connector: "Weds",
      brideName: "Riya Sharma",
      welcomeTop: "WITH LOVE AND BLESSINGS",
      andText: "AND",
      inviteText1: "solicit the honor of your presence to celebrate the wedding of",
      inviteText2: "their beloved children",
      month: "MARCH",
      dateDetails: "SUNDAY | 08 | 2026",
      time: "10:30 AM onwards",
      locationLine1: "THE GOLDEN PLAZA",
      locationLine2: "101 LUXURY DRIVE, NEW DELHI",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "As we join our hearts in marriage, we invite you to be part of our celebration. Your presence and blessings mean the world to us.",
      whatsappNumber: "1234567890",
      audioSrc: "/bg_music.mp3"
    }
  },
  {
    id: "palace-celebration-06",
    slug: "royal-heritage",
    name: "Ornate Palace Celebration",
    price: 1399,
    originalPrice: 2799,
    rating: 4.9,
    reviewsCount: 29,
    category: "Traditional",
    description: "An ultra-premium royal palace wedding invitation theme showcasing magnificent temple archways and grand animations.",
    thumbnail: "/preloader_desktop.webp",
    features: [
      "Grand palace archway entrances",
      "Custom functions timeline animation",
      "Traditional Indian instrumental tracks",
      "One-click WhatsApp RSVP integration"
    ],
    defaultData: {
      showPreloader: true,
      preloaderTime: 0.7,
      groomName: "Arjun Verma",
      connector: "Weds",
      brideName: "Meera Nair",
      welcomeTop: "THE ROYAL CELEBRATION COMMENCES",
      andText: "AND",
      inviteText1: "invite you to witness their sacred vows and join in the wedding celebration",
      inviteText2: "of their wedding day",
      month: "APRIL",
      dateDetails: "SATURDAY | 25 | 2026",
      time: "6:30 PM onwards",
      locationLine1: "THE ROYAL PALACE HALL",
      locationLine2: "55 GRAND PAVILION, UDAIPUR",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "Two stories uniting as one family. We request the honor of your presence as we celebrate this sacred union.",
      whatsappNumber: "9876543210",
      audioSrc: "/bg_music.mp3"
    }
  }
];

