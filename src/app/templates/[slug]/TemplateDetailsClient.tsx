"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Monitor, Smartphone, ExternalLink, Sliders } from 'lucide-react';
import { TEMPLATES } from '@/data/templates';
import { TemplateService } from '@/services/TemplateService';
import type { Template } from '@/types';

interface ComponentProps {
  slug: string;
}

export default function TemplateDetailsClient({ slug }: ComponentProps) {
  const initial = TEMPLATES.find(t => t.slug === slug);
  const [template, setTemplate] = useState<Template | null>(initial || null);

  useEffect(() => {
    async function loadTemplate() {
      try {
        const live = await TemplateService.getBySlug(slug);
        if (live) {
          setTemplate(live);
        }
      } catch (e) {
        console.error("Failed to load live template details:", e);
      }
    }
    loadTemplate();
  }, [slug]);
  
  if (!template && !initial) {
    notFound();
  }
  
  const currentTemplate = template || initial!;
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');

  // Preview URL for the iframe
  const previewUrl = `/invitation/preview?template=${currentTemplate.slug}`;

  return (
    <div className="flex flex-col h-screen bg-[#f7f5f0] text-luxury-dark relative">
      
      {/* Top Navigation Bar */}
      <header className="h-16 sm:h-20 bg-white border-b border-gold-medium/15 px-4 sm:px-6 md:px-12 flex justify-between items-center z-20 shrink-0">
        
        {/* Back and Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/templates" 
            className="p-2 border border-gold-medium/20 hover:border-gold-medium/55 rounded-full hover:bg-gold-light transition-all shrink-0"
            title="Back to collection"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>

          {/* Title - Hidden on mobile to prevent navbar clutter, visible on tablet+ */}
          <div className="hidden md:block">
            <h1 className="font-sansflex font-bold text-base sm:text-lg tracking-wide truncate">
              {currentTemplate.name}
            </h1>
            <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-sansflex font-semibold">
              Live Interactive Preview
            </p>
          </div>
        </div>

        {/* Device Viewport Toggle - Hidden on mobile, visible on desktop/tablet */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#f7f5f0] border border-gold-medium/20 p-1.5 rounded-full">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold font-sansflex transition-all ${
              viewMode === 'mobile'
                ? 'bg-luxury-dark text-gold-light shadow-md'
                : 'text-foreground/50 hover:text-gold-dark'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold font-sansflex transition-all ${
              viewMode === 'desktop'
                ? 'bg-luxury-dark text-gold-light shadow-md'
                : 'text-foreground/50 hover:text-gold-dark'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        {/* Header Action CTA Button - Prominent & Visible */}
        <div className="flex items-center gap-3">
          <Link
            href={`/customize/${currentTemplate.slug}`}
            className="inline-flex items-center justify-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-xs uppercase tracking-widest font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-gold-medium" />
            <span>Customize Template</span>
          </Link>
        </div>

      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow bg-gradient-to-br from-[#f2efe9] to-[#eae5db] flex items-center justify-center p-2 sm:p-6 overflow-hidden relative pb-20 md:pb-6">
        
        {/* On Mobile Screens (md:hidden): Render Full-Width Clean Canvas */}
        <div className="md:hidden w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gold-medium/15 relative">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title={`${currentTemplate.name} Live Preview`}
          />
        </div>

        {/* On Desktop/Tablet Screens (md:flex): Render Frame According to View Mode */}
        {viewMode === 'mobile' ? (
          <div className="hidden md:flex relative w-[330px] aspect-[9/15.3] bg-luxury-dark rounded-[40px] p-2.5 shadow-2xl border-4 border-luxury-dark/95 flex-col justify-stretch overflow-hidden ring-1 ring-gold-medium/25 origin-center transition-all duration-500">
            {/* Phone Speaker Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-luxury-dark rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-800 ml-2" />
              <div className="w-10 h-0.5 bg-neutral-800 rounded-full ml-3" />
            </div>

            {/* Live Preview Canvas */}
            <div className="w-full h-full rounded-[30px] overflow-hidden bg-white relative z-20">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title={`${currentTemplate.name} Live Mobile Preview`}
              />
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-full h-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl border border-gold-medium/15 flex-col transition-all duration-500">
            <div className="h-7 bg-neutral-100 border-b border-neutral-200 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400">varnaminvites.com/invitation/preview?template={currentTemplate.slug}</span>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex-grow bg-white relative">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title={`${currentTemplate.name} Live Desktop Preview`}
              />
            </div>
          </div>
        )}

      </main>

      {/* Floating Bottom Sticky CTA Bar for Mobile Devices */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50">
        <Link
          href={`/customize/${currentTemplate.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-sm uppercase tracking-widest font-bold py-3.5 rounded-full shadow-2xl border border-gold-medium/30 transition-all active:scale-95 cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-gold-medium" />
          <span>Customize Template</span>
        </Link>
      </div>

    </div>
  );
}
