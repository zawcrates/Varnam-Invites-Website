export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

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
  events?: EventItem[];
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
    id: "kovil-vaibhavam",
    slug: "kovil-vaibhavam",
    name: "Kovil Vaibhavam",
    price: 1999,
    originalPrice: 2999,
    rating: 5.0,
    reviewsCount: 1,
    category: "Traditional",
    description:
      "A regal South-Indian temple-inspired wedding invitation with parallax scrolling, parchment canvases, events carousel, map embed, background music and WhatsApp RSVP.",
    thumbnail: "/kovil-vaibhavam/thumbnail.jpeg",
    features: [
      "Parallax hero background with names overlay",
      "Parchment invite canvas with full invite text",
      "Infinite events carousel with royal SVG frames",
      "Google Maps venue embed",
      "Background music player",
      "WhatsApp RSVP button",
      "Animated site preloader (optional)",
      "Fully responsive across all screen sizes",
    ],
    defaultData: {
      showPreloader: false,
      preloaderTime: 0.7,
      groomName: "Virat Kohli",
      connector: "Weds",
      brideName: "Anushka Sharma",
      welcomeTop: "TOGETHER WITH THEIR FAMILIES",
      andText: "AND",
      inviteText1:
        "cordially invite you and your family to join the occasion of",
      inviteText2: "their joyous wedding festivities",
      month: "NOVEMBER",
      dateDetails: "SUNDAY | 23 | 2025",
      time: "7:45 AM - 8:45 AM",
      locationLine1: "THE GRAND BALLROOM",
      locationLine2: "123 WEDDING AVENUE, NEW YORK",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "",
      whatsappNumber: "1234567890",
      audioSrc: "/kovil-vaibhavam/bg_music.mp3",
      events: [
        {
          id: "1",
          title: "HALDI CEREMONY",
          date: "FRIDAY, NOV 21, 2025",
          time: "10:00 AM - 1:00 PM",
          location: "",
        },
        {
          id: "2",
          title: "MEHENDI & SANGEET",
          date: "SATURDAY, NOV 22, 2025",
          time: "4:00 PM ONWARDS",
          location: "",
        },
        {
          id: "3",
          title: "WEDDING CEREMONY",
          date: "SUNDAY, NOV 23, 2025",
          time: "7:45 AM - 8:45 AM",
          location: "",
        },
        {
          id: "4",
          title: "RECEPTION PARTY",
          date: "SUNDAY, NOV 23, 2025",
          time: "7:00 PM ONWARDS",
          location: "",
        },
      ],
    },
  },
  {
    id: "golden-coast",
    slug: "golden-coast",
    name: "Golden Coast",
    price: 1999,
    originalPrice: 2999,
    rating: 5.0,
    reviewsCount: 0,
    category: "Modern",
    description:
      "A cinematic coastal wedding invitation featuring a parallax sunset scene, smooth scrolling, and a dramatic stage reveal.",
    thumbnail: "/golden-coast/thumbnail.jpeg",
    features: [
      "Cinematic parallax sunset background",
      "Smooth Lenis scroll",
      "GSAP ScrollTrigger animations",
      "Layered stage overlay effect",
      "Fully responsive across all screen sizes",
    ],
    defaultData: {
      showPreloader: false,
      preloaderTime: 0,
      groomName: "Arjun",
      connector: "Weds",
      brideName: "Priya",
      welcomeTop: "TOGETHER WITH THEIR FAMILIES",
      andText: "AND",
      inviteText1: "cordially invite you to celebrate",
      inviteText2: "their joyous wedding festivities",
      month: "DECEMBER",
      dateDetails: "SATURDAY | 20 | 2025",
      time: "6:00 PM ONWARDS",
      locationLine1: "THE GOLDEN SHORE RESORT",
      locationLine2: "MARINA BEACH ROAD, CHENNAI",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      storyText: "",
      whatsappNumber: "1234567890",
      audioSrc: "",
      events: [],
    },
  },
];

