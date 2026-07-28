"use client";

import React, { useState } from "react";
import { Crown, Sparkles, CheckCircle2, MessageCircle, ChevronRight, Star, Palette, Clock, Shield } from "lucide-react";
import PremiumPersonalizationModal from "@/components/PremiumPersonalizationModal";
import type { InviteData } from "@/types";

interface PremiumCoupleSectionProps {
  templateSlug: string;
  templateName?: string;
  formData: InviteData;
}

const PREMIUM_FEATURES = [
  {
    icon: Palette,
    title: "Bespoke Artwork",
    desc: "Hand-crafted illustration recreating you and your partner in the exact invitation style.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    desc: "Every artwork is reviewed by our design team before delivery.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    desc: "Receive your personalised couple artwork within 24–48 hours.",
  },
];

const WHAT_WE_DO = [
  "Match your facial features & skin tones",
  "Recreate traditional bridal & groom attire",
  "Preserve the temple & invitation art style",
  "Deliver high-resolution print-ready files",
];

export default function PremiumCoupleSection({
  templateName,
  formData,
}: PremiumCoupleSectionProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="space-y-4 sm:space-y-6 animate-fade-in text-left">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-luxury-dark via-[#1c150e] to-luxury-dark rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-6">
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gold-dark/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gold-medium/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-gold-dark/20 border border-gold-medium/30 text-gold-light text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4">
              <Star className="w-2.5 h-2.5 fill-gold-medium text-gold-medium" />
              Premium Add-on
            </div>

            {/* Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-dark/30 border border-gold-medium/30 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-gold-light tracking-wide leading-tight">
                Premium Couple<br />Artwork
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Have the couple in your invitation professionally recreated to
              resemble you and your partner — while perfectly matching the
              artistic style of your chosen template.
            </p>
          </div>
        </div>

        {/* What we do */}
        <div className="bg-gold-light/20 border border-gold-medium/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4">
          <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
            <Sparkles className="w-4 h-4 text-gold-dark" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-gold-dark">
              What We Create For You
            </p>
          </div>
          <ul className="space-y-2">
            {WHAT_WE_DO.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 sm:gap-2.5 text-xs font-medium text-luxury-dark"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feature Cards */}
        <div className="space-y-2.5 sm:space-y-3">
          {PREMIUM_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 bg-white border border-gold-medium/15 rounded-xl p-3.5 sm:p-4 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-gold-light/50 border border-gold-medium/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-gold-dark" />
              </div>
              <div>
                <p className="text-xs font-bold text-luxury-dark mb-0.5">{title}</p>
                <p className="text-[11px] text-foreground/60 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="border border-gold-medium/15 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 bg-white">
          <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/50 mb-3">
            How It Works
          </p>
          <ol className="space-y-2.5 sm:space-y-3">
            {[
              "Click Continue on WhatsApp",
              "Send us your photos",
              "We create your custom artwork",
              "You receive your personalised invitation",
            ].map((step, i) => (
              <li key={step} className="flex items-center gap-2.5 sm:gap-3 text-xs text-luxury-dark">
                <span className="w-5 h-5 rounded-full bg-luxury-dark text-gold-light flex items-center justify-center text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="font-medium">{step}</span>
                {i < 3 && <ChevronRight className="w-3 h-3 text-gold-medium/40 ml-auto shrink-0" />}
              </li>
            ))}
          </ol>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 sm:gap-2.5 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-bold text-xs sm:text-sm py-3.5 sm:py-4 px-5 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:scale-[1.01] hover:shadow-lg cursor-pointer border border-gold-medium/20"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366]" />
          <span>Request Premium Artwork</span>
          <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
        </button>

        <p className="text-center text-[10px] text-foreground/40 font-medium -mt-1 sm:-mt-2">
          Our team will reply with pricing &amp; turnaround time on WhatsApp.
        </p>
      </div>

      {/* Modal */}
      <PremiumPersonalizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        templateName={templateName}
      />
    </>
  );
}
