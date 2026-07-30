import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "Contact Us & Customer Support",
  description:
    "Get in touch with the Varnam Invites team. Have questions about digital wedding invitations, template customization, or orders? We are here to help.",
  path: "/contact",
  keywords: [
    "contact varnam invites",
    "wedding invitation customer support",
    "varnam invites email phone",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
