import { constructMetadata } from "@/lib/seo.config";

export const metadata = constructMetadata({
  title: "Checkout",
  description: "Complete your order securely on Varnam Invites.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
