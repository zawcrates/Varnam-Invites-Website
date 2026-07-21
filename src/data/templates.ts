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

export const TEMPLATES: Template[] = [];

