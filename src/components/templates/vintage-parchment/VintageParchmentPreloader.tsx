"use client";

import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  duration?: number;
}

export default function VintageParchmentPreloader({ duration = 0.7 }: PreloaderProps) {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Ensure duration doesn't exceed the max of 1.3 seconds
    const safeDuration = Math.min(duration, 1.3);
    const fadeWaitTime = safeDuration * 1000;

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, fadeWaitTime);

    // Remove from DOM after transition completes
    const removeTimer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = '';
    }, fadeWaitTime + 800); // fadeWaitTime + 800ms transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, [duration]);

  if (!loading) return null;

  const animationDuration = Math.min(duration, 1.3) + 1.5;

  return (
    <div 
      className="preloader-container" 
      style={{
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? 'none' : 'auto'
      }}
    >
      <picture>
        <source media="(max-width: 768px)" srcSet="/preloader_mobile.webp" />
        <img 
          src="/preloader_desktop.webp" 
          alt="Loading..." 
          className="preloader-zoom-animation"
          style={{ animationDuration: `${animationDuration}s` }}
        />
      </picture>
    </div>
  );
}
