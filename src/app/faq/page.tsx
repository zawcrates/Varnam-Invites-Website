"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, Search, HelpCircle, Sparkles } from "lucide-react";

export const FAQS = [
  {
    id: 1,
    question: "What happens after I purchase a wedding invitation?",
    answer:
      "After successful payment verification, your Varnam wedding website is instantly published and live. You customize and preview all your wedding details before payment; once published upon purchase, your live website link is delivered directly to your email for sharing with your guests.",
  },
  {
    id: 2,
    question: "Can I preview the wedding invitation before buying it?",
    answer:
      "Yes. You can preview and fully customize our digital wedding invitation templates before purchasing so you can see the exact design, animations, typography, and overall interactive experience.",
  },
  {
    id: 3,
    question: "How do I add my wedding details to the invitation?",
    answer:
      "Varnam provides a simple live customization experience where you can enter details such as your names, wedding date, venue, location map, and event timeline before completing your purchase.",
  },
  {
    id: 4,
    question: "Do I need coding knowledge to customize my invitation?",
    answer:
      "No. You don't need any coding or web development knowledge. Varnam is designed so couples can personalize their invitation effortlessly without editing any code.",
  },
  {
    id: 5,
    question: "Can I create my invitation using my phone?",
    answer:
      "Yes. You can access Varnam from your smartphone and use all supported customization and preview features without needing a computer.",
  },
  {
    id: 6,
    question: "How do I share my digital wedding invitation with guests?",
    answer:
      "Once your invitation is published upon payment, you can share its shareable web link with your guests through WhatsApp, Instagram, email, or any messaging platform.",
  },
  {
    id: 7,
    question: "Do my guests need to download an app?",
    answer:
      "No. Your guests can open your digital wedding invitation directly through their web browser using the link you send them, with zero app installation required.",
  },
  {
    id: 8,
    question: "Do my guests need a Varnam account to view the invitation?",
    answer:
      "No. Guests do not need an account or sign-in to view your published wedding invitation.",
  },
  {
    id: 9,
    question: "Will I need to buy a domain name for my wedding invitation?",
    answer:
      "No. You don't need to purchase or configure a separate domain. Your published Varnam invitation comes with a lifetime shareable web link included.",
  },
  {
    id: 10,
    question: "Can I share my wedding invitation on WhatsApp?",
    answer:
      "Yes. Varnam invitations are optimized for seamless sharing on WhatsApp, making it simple and elegant to invite friends and family digitally.",
  },
  {
    id: 11,
    question: "Can I make changes after payment?",
    answer:
      "No. You can freely edit and customize all supported wedding details before payment. Once payment is completed and your invitation is published, editing is locked and cannot be modified.",
  },
  {
    id: 12,
    question: "Can I add multiple wedding events to my invitation?",
    answer:
      "Depending on the template, you can include multiple celebrations such as your engagement, Haldi, Mehendi, Sangeet, wedding ceremony, and reception.",
  },
  {
    id: 13,
    question: "Can I add music to my digital wedding invitation?",
    answer:
      "Yes. Background music is provided as part of supported template designs. Please note that custom background music uploads are not supported.",
  },
  {
    id: 14,
    question: "What is included with a Varnam wedding invitation?",
    answer:
      "Your purchase includes lifetime server hosting, access to the selected digital invitation design, live customization, and an instant shareable link delivered directly to your email.",
  },
  {
    id: 15,
    question: "Are Varnam invitations mobile-friendly?",
    answer:
      "Yes. Our digital wedding invitations are designed mobile-first, ensuring a stunning and responsive viewing experience across all smartphones and screen sizes.",
  },
  {
    id: 16,
    question: "Do you offer Tamil and South Indian wedding invitations?",
    answer:
      "Yes. Varnam offers digital invitation designs inspired by Tamil, South Indian, and broader Indian wedding celebrations, alongside contemporary styles.",
  },
  {
    id: 17,
    question: "Can I use my invitation for a destination wedding?",
    answer:
      "Yes. You can use suitable Varnam templates for destination weddings, beach weddings, and grand celebrations by entering your venue and event details during customization.",
  },
  {
    id: 18,
    question: "Do you create completely custom wedding invitations?",
    answer:
      "Our primary service is our curated collection of pre-designed digital wedding invitation templates. If bespoke custom design services are available, they will be announced separately on our website.",
  },
  {
    id: 19,
    question: "Can I resell or share a Varnam template with someone else?",
    answer:
      "No. Your purchase provides a personal-use licence for the associated wedding or event. Varnam templates may not be resold, redistributed, or commercially reproduced.",
  },
  {
    id: 20,
    question: "What is Varnam Invites' refund policy?",
    answer:
      "Because our invitations are digital products, purchases are generally non-refundable after access has been provided. Exceptions apply for duplicate charges or technical non-delivery caused by us. Please see our Refund Policy for full details.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-left">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-gold-dark text-xs uppercase tracking-widest font-semibold block">
            Help &amp; Questions
          </span>
          <h1 className="font-sansflex text-3xl md:text-5xl text-luxury-dark font-bold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed font-sans">
            Everything you need to know about Varnam Invites digital wedding cards, customization, pricing, and sharing.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="w-5 h-5 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., editing, music, sharing...)"
            className="w-full bg-white border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-full pl-12 pr-6 py-3.5 text-sm text-luxury-dark outline-none transition-all luxury-shadow"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-gold-medium/15 rounded-2xl p-8 text-center text-foreground/60 space-y-2">
              <HelpCircle className="w-10 h-10 text-gold-medium/40 mx-auto" />
              <p className="text-sm">No matching questions found for &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-gold-dark underline font-bold"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-gold-medium/15 rounded-2xl overflow-hidden luxury-shadow transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="font-sansflex text-base font-bold text-luxury-dark group-hover:text-gold-dark transition-colors pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gold-dark shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 md:px-6 md:pb-6 text-sm text-foreground/75 leading-relaxed border-t border-gold-medium/5 pt-4 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Banner */}
        <div className="mt-16 bg-gold-light/30 border border-gold-medium/20 rounded-3xl p-8 text-center space-y-3">
          <Sparkles className="w-6 h-6 text-gold-dark mx-auto" />
          <h3 className="font-sansflex text-lg font-bold text-luxury-dark">Still have questions?</h3>
          <p className="text-xs text-foreground/70 max-w-md mx-auto">
            Our support team is happy to help you with your wedding invitation customization or order details.
          </p>
          <a
            href="/contact"
            className="inline-flex justify-center text-xs uppercase tracking-widest font-semibold bg-luxury-dark hover:bg-gold-dark text-white px-6 py-3 rounded-full transition-all mt-2"
          >
            Contact Us &rarr;
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
