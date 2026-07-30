import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "Wedding Invitation Templates & Websites | Browse Designs",
  description:
    "Explore our collection of premium digital wedding invitation templates. Filter by Traditional, Vintage, Modern styles with background music, Google Maps, and live customization.",
  path: "/templates",
  keywords: [
    "wedding invitation templates",
    "digital marriage card designs",
    "wedding website templates",
    "traditional indian wedding card",
    "kovil vaibhavam template",
  ],
});

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
