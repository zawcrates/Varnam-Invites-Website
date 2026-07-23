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

  // Auto scroll every 5 seconds
  useEffect(() => {
    if (templates.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext, templates.length]);

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center">
      {/* Carousel Main Container */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[430px] flex items-center justify-center overflow-visible">
        
        {/* Cards Container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">
          {templates.map((template, index) => {
            let offset = index - activeIndex;

            if (templates.length === 2) {
              // 2-template back and forth sliding logic:
              // activeIndex 0 -> template 0 is active (center, offset 0), template 1 is on right (offset +1)
              // activeIndex 1 -> template 1 is active (center, offset 0), template 0 is on left (offset -1)
              if (activeIndex === 1 && index === 0) {
                offset = -1;
              } else if (activeIndex === 0 && index === 1) {
                offset = 1;
              }
            } else if (templates.length > 2) {
              const half = Math.floor(templates.length / 2);
              while (offset > half) offset -= templates.length;
              while (offset <= -half) offset += templates.length;
            }

            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;

            const isMobile = windowWidth < 640;
            const isTablet = windowWidth >= 640 && windowWidth < 1024;

            // Strict 3:4 Aspect Ratio dimensions (width x height)
            const activeWidth = isMobile ? 225 : isTablet ? 270 : 300;
            const activeHeight = isMobile ? 300 : isTablet ? 360 : 400; // 300x400 = 3:4 ratio

            const sideWidth = isMobile ? 180 : isTablet ? 216 : 240;
            const sideHeight = isMobile ? 240 : isTablet ? 288 : 320; // 240x320 = 3:4 ratio

            const offsetDistance = isMobile ? 130 : isTablet ? 180 : 210;

            let xTranslation = 0;
            let scale = 0.88;
            let opacity = 0;
            let zIndex = 10;

            if (isActive) {
              xTranslation = 0;
              scale = 1.0;
              opacity = 1;
              zIndex = 30;
            } else if (isPrev) {
              xTranslation = -offsetDistance;
              scale = 0.88;
              opacity = isMobile ? 0.4 : 0.75;
              zIndex = 20;
            } else if (isNext) {
              xTranslation = offsetDistance;
              scale = 0.88;
              opacity = isMobile ? 0.4 : 0.75;
              zIndex = 20;
            } else {
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
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className="absolute bg-luxury-cream shadow-[0_20px_45px_rgba(18,18,18,0.15)] rounded-[24px] sm:rounded-[32px] overflow-hidden select-none border border-gold-medium/10 cursor-pointer group"
              >
                {/* 3:4 Aspect Ratio Image Container */}
                <div className="relative w-full h-full aspect-[3/4]">
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
                    <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-40">
                      <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/40 hover:bg-white/60 border border-white/40 text-black shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-black" strokeWidth={3} />
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
      <div className="flex items-center gap-2.5 mt-8 sm:mt-10">
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
