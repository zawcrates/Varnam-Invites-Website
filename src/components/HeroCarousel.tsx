"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { TEMPLATES } from '@/data/templates';
import { TemplateService } from '@/services/TemplateService';
import type { Template } from '@/types';

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(1024);
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const live = await TemplateService.getAll();
        if (live && live.length > 0) {
          setTemplates(live);
        }
      } catch (e) {
        console.error("Failed to load carousel templates:", e);
      }
    }
    loadTemplates();
  }, []);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (templates.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % templates.length);
  }, [templates.length]);

  // Auto scroll every 6 seconds
  useEffect(() => {
    if (templates.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [handleNext, templates.length]);

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] w-full max-w-[400px] mx-auto text-center border border-dashed border-gold-medium/30 rounded-[32px] bg-gold-light/10 p-8 select-none">
        <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3">Exclusive Launch</span>
        <h3 className="text-xl font-sansflex font-medium text-luxury-dark tracking-wide">New Catalog Coming Soon</h3>
        <p className="text-xs text-foreground/50 max-w-[260px] mt-2.5 leading-relaxed font-sansflex">
          We are upgrading our template collection with brand new premium designs. Stay tuned for our upcoming launch!
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center">
      {/* Carousel Main Container */}
      <div className="relative w-full h-[400px] flex items-center justify-center overflow-visible">
        
        {/* Cards Container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">
          {templates.map((template, index) => {
            // Calculate relative offset of this card from active index
            let offset = index - activeIndex;

            // Handle loop wrap-around calculations
            const half = Math.floor(templates.length / 2);
            while (offset > half) offset -= templates.length;
            while (offset <= -half) offset += templates.length;

            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;

            // Define scale and opacity based on active status
            let xTranslation = 0;
            let scale = 0.8;
            let opacity = 0;
            let zIndex = 10;
            
            const isMobile = windowWidth < 640;
            const isTablet = windowWidth >= 640 && windowWidth < 1024;

            // Card size variables
            const activeWidth = isMobile ? 240 : isTablet ? 280 : 257;
            const activeHeight = isMobile ? 310 : isTablet ? 350 : 457;

            const sideWidth = isMobile ? 180 : isTablet ? 220 : 200;
            const sideHeight = isMobile ? 240 : isTablet ? 280 : 355;

            const offsetDistance = isMobile ? 120 : isTablet ? 190 : 200;

            if (isActive) {
              xTranslation = 0;
              scale = 1.0;
              opacity = 1;
              zIndex = 30;
            } else if (isPrev) {
              xTranslation = -offsetDistance;
              scale = 0.92;
              opacity = isMobile ? 0.25 : 0.65;
              zIndex = 20;
            } else if (isNext) {
              xTranslation = offsetDistance;
              scale = 0.92;
              opacity = isMobile ? 0.25 : 0.65;
              zIndex = 20;
            } else {
              // Position cards that are hidden further away
              xTranslation = offset < 0 ? -offsetDistance - 40 : offsetDistance + 40;
              scale = 0.7;
              opacity = 0;
              zIndex = 10;
            }

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: xTranslation,
                  scale,
                  opacity,
                  zIndex,
                  width: isActive ? activeWidth : sideWidth,
                  height: isActive ? activeHeight : sideHeight,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 1, 0.5, 1]
                }}
                onClick={() => {
                  if (isActive) {
                    router.push(`/templates/${template.slug}`);
                  } else if (isPrev || isNext) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute bg-luxury-cream shadow-[0_20px_45px_rgba(18,18,18,0.15)] rounded-[32px] overflow-hidden select-none border border-gold-medium/10 cursor-pointer group`}
              >
                {/* Image and Overlays */}
                <div className="relative w-full h-full">
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    draggable={false}
                  />
                  {isActive && (
                    <div className="absolute top-5 right-5 z-40">
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white/40 hover:bg-white/60 border border-white/40 text-black shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300">
                        <ArrowUpRight className="w-5 h-5 text-black" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bullet / Dot Indicators */}
      <div className="flex items-center gap-2.5 mt-15">
        {templates.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? 'w-7 bg-luxury-dark' 
                : 'w-2 bg-luxury-dark/20 hover:bg-luxury-dark/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
