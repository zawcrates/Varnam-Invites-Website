import { constructMetadata } from "@/lib/seo.config";
import { FAQJsonLd } from "@/components/JsonLd";
import { FAQS } from "@/data/faqs";

export const metadata = constructMetadata({
  title: "Frequently Asked Questions (FAQ)",
  description:
    "Find instant answers to common questions about digital wedding invitations, live customization, music, RSVP tracking, Google Maps directions, and ordering on Varnam Invites.",
  path: "/faq",
  keywords: [
    "varnam invites faq",
    "digital wedding card questions",
    "how to make wedding website online",
  ],
});

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const formattedFaqs = FAQS.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <>
      <FAQJsonLd faqs={formattedFaqs} />
      {children}
    </>
  );
}
