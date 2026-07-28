"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, Search, HelpCircle, Sparkles } from "lucide-react";
import { FAQS } from "@/data/faqs";

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
