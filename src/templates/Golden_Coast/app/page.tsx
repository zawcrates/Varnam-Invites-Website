'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { registerGSAP } from '@/animations/gsap';
import gsap from 'gsap';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function Home() {
  // Activate Lenis smooth scrolling
  useSmoothScroll();

  const sunsetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Register ScrollTrigger
    registerGSAP();

    // Context for cleanup
    const ctx = gsap.context(() => {
      // Parallax effect:
      // Scrolling down pushes the container up, but we push the sunset down by 30%
      // resulting in a perceived 70% scroll speed.
      gsap.to(sunsetRef.current, {
        yPercent: 25, // Adjust this value to tweak the parallax intensity
        ease: 'none',
        scrollTrigger: {
          trigger: sunsetRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-white min-h-[200vh] overflow-y-auto">
      {/* Negative margin is reduced on mobile/tablet to prevent the image from disappearing, and set to -mt-150 on desktop */}
      {/* Negative margin is reduced on mobile/tablet to prevent the image from disappearing, and set to -mt-150 on desktop */}
      <div className="grid grid-cols-1 w-full -mt-24 sm:-mt-48 md:-mt-80 lg:-mt-150">
        {/* Base Layer: Sunset */}
        <div className="col-start-1 row-start-1 w-full">
          <Image
            ref={sunsetRef}
            src="/images/Sunset.png"
            alt="Sunset"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto block"
            priority
          />
        </div>

        {/* Overlay Layer: Stage */}
        <div className="col-start-1 row-start-1 w-full z-10 mt-[300px] sm:mt-[650px] md:mt-[800px] lg:mt-[1000px]">
          <Image
            src="/images/stage.png"
            alt="Stage"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto block"
            priority
          />
        </div>
      </div>
    </main>
  );
}
