import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Varnam Invites | Premium Digital Wedding Invitations",
  description: "Browse professionally designed digital wedding invitation templates, preview, personalize, and share your special day with elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body className="font-sansflex antialiased bg-background text-foreground">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
