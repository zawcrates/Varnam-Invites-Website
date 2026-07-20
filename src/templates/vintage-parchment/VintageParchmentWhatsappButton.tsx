"use client";

import React from 'react';

interface WhatsappButtonProps {
  whatsappNumber: string;
}

export default function VintageParchmentWhatsappButton({ whatsappNumber }: WhatsappButtonProps) {
  return (
    <div className="wa-button-wrapper">
      <div className="wa-container">
        <a 
          className="wa-toggle"
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          title="RSVP via WhatsApp"
        >
          <span className="wa-btn-circle" />
          <span className="wa-label">
            <img src="/whatsapp.png" alt="WhatsApp RSVP" className="wa-whatsapp-icon" />
          </span>
        </a>
      </div>
    </div>
  );
}
