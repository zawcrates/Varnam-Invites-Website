import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "Live Invitation Customizer",
  description: "Personalize your wedding invitation details live.",
  path: "/customize",
  noIndex: true,
});

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
