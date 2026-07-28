"use client";

import React from "react";
import { CheckCircle2, MessageCircle, Edit3, X } from "lucide-react";

export interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  groomName: string;
  brideName: string;
  month?: string;
  dateDetails?: string;
  venueLine1?: string;
  venueLine2?: string;
  previewUrl?: string;
  additionalNotes?: string;
}

export function generateWhatsAppMessage({
  templateName,
  groomName,
  brideName,
  month,
  dateDetails,
  venueLine1,
  venueLine2,
  previewUrl,
  additionalNotes,
}: {
  templateName: string;
  groomName: string;
  brideName: string;
  month?: string;
  dateDetails?: string;
  venueLine1?: string;
  venueLine2?: string;
  previewUrl?: string;
  additionalNotes?: string;
}): string {
  const lines = [
    `*NEW INVITATION ORDER INQUIRY - VARNAM INVITES*`,
    ``,
    `*Template:* ${templateName || "Kovil Vaibhavam"}`,
    `*Couple:* ${groomName || "Groom"} & ${brideName || "Bride"}`,
    month || dateDetails ? `*Date:* ${[month, dateDetails].filter(Boolean).join(" | ")}` : "",
    venueLine1 || venueLine2 ? `*Venue:* ${[venueLine1, venueLine2].filter(Boolean).join(", ")}` : "",
    previewUrl ? `*Live Preview Link:* ${previewUrl}` : "",
    additionalNotes ? `*Notes:* ${additionalNotes}` : "",
    ``,
    `Hi Varnam Invites Team! I have finished customising my invitation. Please help me review and confirm my order.`,
  ].filter((line) => line !== "");

  return lines.join("\n");
}

export default function WhatsAppOrderModal({
  isOpen,
  onClose,
  templateName,
  groomName,
  brideName,
  month,
  dateDetails,
  venueLine1,
  venueLine2,
  previewUrl,
  additionalNotes,
}: WhatsAppOrderModalProps) {
  if (!isOpen) return null;

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3004";

  const fullPreviewUrl = previewUrl
    ? previewUrl.startsWith("http")
      ? previewUrl
      : `${siteUrl}${previewUrl}`
    : "";

  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916379237294";
  const cleanPhone = whatsappPhone.replace(/[^0-9]/g, "");

  const rawMessage = generateWhatsAppMessage({
    templateName,
    groomName,
    brideName,
    month,
    dateDetails,
    venueLine1,
    venueLine2,
    previewUrl: fullPreviewUrl,
    additionalNotes,
  });

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(rawMessage)}`;

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white border border-gold-medium/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 luxury-shadow relative overflow-hidden text-left animate-scale-up">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-foreground/40 hover:text-luxury-dark p-1 rounded-full hover:bg-gold-light/40 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-4 pr-6">
          <div className="w-10 h-10 rounded-full bg-gold-light/40 border border-gold-medium/20 flex items-center justify-center shrink-0 text-gold-dark">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-sansflex text-xl sm:text-2xl font-bold text-luxury-dark tracking-wide">
              🎉 Your Invitation is Ready!
            </h3>
          </div>
        </div>

        {/* Customization Details Summary Card */}
        <div className="bg-gold-light/20 border border-gold-medium/15 rounded-2xl p-4 mb-5 text-xs text-luxury-dark space-y-1.5">
          <p className="font-sansflex font-bold text-sm text-gold-dark">{templateName}</p>
          <p className="font-medium text-luxury-dark">
            {groomName} &amp; {brideName}
          </p>
          {(month || dateDetails) && (
            <p className="text-foreground/70">
              {[month, dateDetails].filter(Boolean).join(" | ")}
            </p>
          )}
          {venueLine1 && <p className="text-foreground/60 truncate">{venueLine1}</p>}
        </div>

        {/* Process Explanation */}
        <div className="space-y-3 mb-6 text-xs sm:text-sm text-foreground/75 leading-relaxed">
          <p className="font-sans font-medium text-luxury-dark">
            Your invitation has been successfully customised.
          </p>
          <p className="text-foreground/70">
            To ensure every invitation is reviewed before delivery, we currently
            complete orders personally through WhatsApp.
          </p>
          <div className="bg-white border border-gold-medium/10 rounded-2xl p-4 space-y-2 text-xs font-sans">
            <p className="font-semibold text-luxury-dark uppercase tracking-wider text-[10px]">
              Our team will:
            </p>
            <ul className="space-y-1.5 text-foreground/80 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                Review your invitation details
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                Confirm your customisation &amp; styling
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                Answer your questions &amp; special requests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                Guide you through the final order delivery
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-sansflex text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-full transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer text-center"
          >
            <MessageCircle className="w-4 h-4 fill-current stroke-none" />
            <span>Continue on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-gold-medium/20 hover:border-gold-dark text-luxury-dark font-sansflex text-xs uppercase tracking-widest font-semibold py-3.5 px-5 rounded-full transition-all hover:bg-gold-light/20 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-gold-dark" />
            <span>Continue Editing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
