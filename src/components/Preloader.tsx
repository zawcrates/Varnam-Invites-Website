"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Unmount after the full 2s animation completes
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="preloader-overlay"
      aria-hidden="true"
      role="presentation"
    >
      {/* Desktop image */}
      <Image
        src="/preloader_desktop.webp"
        alt="Varnam Invites loading"
        fill
        priority
        className="object-cover hidden sm:block"
        sizes="100vw"
      />
      {/* Mobile image */}
      <Image
        src="/preloader_mobile.webp"
        alt="Varnam Invites loading"
        fill
        priority
        className="object-cover block sm:hidden"
        sizes="100vw"
      />

      {/* Subtle vignette */}
      <div className="preloader-vignette" />
    </div>
  );
}
