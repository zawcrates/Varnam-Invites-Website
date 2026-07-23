'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { TemplateRendererProps } from '@/templates';
import './styles.css';

// ---------------------------------------------------------------------------
// GSAP & Lenis — loaded lazily so they never run on the server
// ---------------------------------------------------------------------------

let gsapLoaded = false;

const loadGSAP = async () => {
  if (gsapLoaded || typeof window === 'undefined') return;
  gsapLoaded = true;
  const gsap = (await import('gsap')).default;
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
};

const startLenis = async () => {
  if (typeof window === 'undefined') return;
  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GoldenCoast({ inviteData }: TemplateRendererProps) {
  const sunsetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let lenisInstance: import('lenis').default | undefined;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      await loadGSAP();
      lenisInstance = await startLenis();

      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      ctx = gsap.context(() => {
        gsap.to(sunsetRef.current, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: sunsetRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        ScrollTrigger.refresh();
      });
    })();

    return () => {
      ctx?.revert();
      lenisInstance?.destroy();
    };
  }, []);

  // inviteData with fallbacks
  const groomName = inviteData?.groomName || 'Arjun';
  const brideName = inviteData?.brideName || 'Priya';
  const connector = inviteData?.connector || 'Weds';
  const welcomeTop = inviteData?.welcomeTop || 'TOGETHER WITH THEIR FAMILIES';
  const inviteText1 = inviteData?.inviteText1 || 'cordially invite you to celebrate their wedding';
  const dateDetails = inviteData?.dateDetails || 'SATURDAY | 20 | DECEMBER 2025';
  const locationLine1 = inviteData?.locationLine1 || 'THE GOLDEN SHORE RESORT';

  return (
    <main className="gc-root">
      {/* Names & Header Overlay */}
      <div className="gc-names-overlay">
        <span className="gc-welcome">{welcomeTop}</span>
        <div className="gc-couple-names">
          <span className="gc-name">{groomName}</span>
          <span className="gc-connector">{connector}</span>
          <span className="gc-name">{brideName}</span>
        </div>
        <p className="gc-invite-text">{inviteText1}</p>
        <div className="gc-details-badge">
          <span>{dateDetails}</span>
          <span className="gc-dot">•</span>
          <span>{locationLine1}</span>
        </div>
      </div>

      {/* Layered parallax scene */}
      <div className="gc-scene">
        {/* Base Layer: Sunset */}
        <div className="gc-layer gc-layer-base">
          <Image
            ref={sunsetRef}
            src="/golden-coast/Sunset.png"
            alt="Sunset"
            width={1920}
            height={1080}
            sizes="100vw"
            className="gc-img"
            priority
            unoptimized
          />
        </div>

        {/* Overlay Layer: Stage */}
        <div className="gc-layer gc-layer-stage">
          <Image
            src="/golden-coast/stage.png"
            alt="Stage"
            width={1920}
            height={1080}
            sizes="100vw"
            className="gc-img"
            priority
            unoptimized
          />
        </div>
      </div>
    </main>
  );
}
