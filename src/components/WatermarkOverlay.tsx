"use client";

import React from "react";
import Image from "next/image";

export default function WatermarkOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none select-none z-[99999] overflow-hidden flex flex-col justify-around items-center py-10 opacity-75"
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-row items-center justify-center gap-3 sm:gap-5 p-2">
          <Image
            src="/Varnam_svg1.png"
            alt="Varnam Invites Watermark Logo"
            width={200}
            height={100}
            className="object-contain w-44 sm:w-56 drop-shadow-md brightness-105"
            priority
          />
          <span 
            className="hidden sm:inline-block text-lg sm:text-2xl uppercase tracking-[0.3em] font-black text-white drop-shadow-md leading-none"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            PREVIEW
          </span>
        </div>
      ))}
    </div>
  );
}
