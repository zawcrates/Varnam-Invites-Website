"use client";

import React from "react";
import { CheckCircle2, MessageCircle, Crown, X, Star } from "lucide-react";
import type { InviteData } from "@/types";

interface PremiumPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: InviteData;
  templateName?: string;
}

function generatePersonalizationWhatsAppMessage({
  brideName,
  groomName,
  weddingDate,
  templateName,
}: {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  templateName?: string;
}): string {
  const lines = [
    `Hi Varnam Invites 👋`,
    ``,
    `I'd like to request *Premium Couple Personalization*.`,
    ``,
    `*Template:* ${templateName || "Kovil Vaibhavam"}`,
    `*Bride Name:* ${brideName || ""}`,
    `*Groom Name:* ${groomName || ""}`,
    `*Wedding Date:* ${weddingDate || ""}`,
    ``,
    `I'll send our photos here.`,
    ``,
    `Please let me know the pricing and turnaround time.`,
  ];
  return lines.join("\n");
}

export default function PremiumPersonalizationModal({
  isOpen,
  onClose,
  formData,
  templateName,
}: PremiumPersonalizationModalProps) {
  if (!isOpen) return null;

  const whatsappPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916379237294";
  const cleanPhone = whatsappPhone.replace(/[^0-9]/g, "");

  const weddingDate = [formData.month, formData.dateDetails]
    .filter(Boolean)
    .join(" | ");

  const message = generatePersonalizationWhatsAppMessage({
    brideName: formData.brideName || "",
    groomName: formData.groomName || "",
    weddingDate,
    templateName,
  });

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const includes = [
    "Custom couple artwork",
    "Matches invitation art style",
    "Personal quality review",
    "High-resolution delivery",
    "Premium support",
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-gold-medium/20 rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-left animate-scale-up">
        {/* Gold gradient top bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-foreground/40 hover:text-luxury-dark p-1 rounded-full hover:bg-gold-light/40 transition-colors z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 pt-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-dark to-gold-medium flex items-center justify-center shrink-0 shadow-md">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-luxury-dark/5 border border-luxury-dark/10 text-luxury-dark text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
                <Star className="w-2.5 h-2.5 fill-gold-dark text-gold-dark" />
                Premium Add-on
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-luxury-dark tracking-wide leading-tight">
                Premium Couple<br />Personalization
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/70 leading-relaxed mb-5">
            Make your invitation truly yours. We&apos;ll professionally recreate
            the bride and groom in your chosen invitation using your
            photos, while preserving the artistic style of the template.
          </p>

          {/* Includes */}
          <div className="bg-gold-light/30 border border-gold-medium/20 rounded-2xl p-4 mb-6">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gold-dark mb-3">
              What&apos;s Included
            </p>
            <ul className="space-y-2">
              {includes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm font-medium text-luxury-dark"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold-dark shrink-0 fill-gold-light stroke-gold-dark" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:scale-[1.02] hover:shadow-xl cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current stroke-none" />
            Continue on WhatsApp
          </a>

          <p className="text-center text-[10px] text-foreground/40 mt-3 font-medium">
            Our team will reply with pricing &amp; turnaround time.
          </p>
        </div>
      </div>
    </div>
  );
}
