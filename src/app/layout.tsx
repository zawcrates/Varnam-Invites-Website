import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { constructMetadata } from "@/lib/seo.config";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to font domains for low-latency network handshake */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Optimized non-blocking Google Fonts stylesheet */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Afacad:ital,wght@0,400..700;1,400..700&family=Fondamento:ital@0;1&display=swap"
        />

        {/* High-priority preloading of template custom font files */}
        <link rel="preload" href="/Sunroll.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/Whitley Pattrycia.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/Fondamento-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/Afacad-VariableFont_wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/white-space.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
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
