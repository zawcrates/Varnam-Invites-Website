import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://varnaminvites.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Varnam Invites | Premium Digital Wedding Invitations",
    template: "%s | Varnam Invites",
  },
  description: "Browse professionally designed digital wedding invitation templates, preview, personalize, and share your special day with elegance.",
  keywords: ["wedding invitation", "digital card", "wedding website", "online invitation", "indian wedding", "customizable wedding card"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Varnam Invites",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility contrast check
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="font-sansflex antialiased bg-background text-foreground">
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
