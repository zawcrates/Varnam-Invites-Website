import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "My Dashboard & Invites",
  description: "View and manage your customized digital wedding invitations.",
  path: "/my-invites",
  noIndex: true,
});

export default function MyInvitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
