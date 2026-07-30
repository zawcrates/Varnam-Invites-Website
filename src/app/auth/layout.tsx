import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "Account Authentication",
  description: "Sign in or sign up to Varnam Invites.",
  path: "/auth",
  noIndex: true,
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
