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
    <div className="flex flex-col h-screen bg-[#f7f5f0] text-luxury-dark">
      
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b border-gold-medium/15 px-6 md:px-12 flex justify-between items-center z-10 shrink-0">
        
        {/* Back and Title */}
        <div className="flex items-center gap-4">
          <Link 
            href="/templates" 
            className="p-2 border border-gold-medium/20 hover:border-gold-medium/55 rounded-full hover:bg-gold-light transition-all"
            title="Back to collection"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <div className="max-w-[120px] sm:max-w-none">
            <h1 className="font-sansflex font-bold text-sm sm:text-lg tracking-wide truncate">
              {currentTemplate.name}
            </h1>
            <p className="hidden sm:block text-[10px] text-foreground/50 uppercase tracking-widest font-sansflex font-semibold">
              Live Interactive Preview
            </p>
          </div>
        </div>

        {/* Device Viewport Toggle */}
        <div className="flex items-center gap-1.5 bg-[#f7f5f0] border border-gold-medium/20 p-1.5 rounded-full">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold font-sansflex transition-all ${
              viewMode === 'mobile'
                ? 'bg-luxury-dark text-gold-light shadow-md'
                : 'text-foreground/50 hover:text-gold-dark'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold font-sansflex transition-all ${
              viewMode === 'desktop'
                ? 'bg-luxury-dark text-gold-light shadow-md'
                : 'text-foreground/50 hover:text-gold-dark'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href={`/customize/${currentTemplate.slug}`}
            className="inline-flex items-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-xs uppercase tracking-widest font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize Template</span>
            <span className="inline sm:hidden">Customize</span>
          </Link>
        </div>

      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow bg-gradient-to-br from-[#f2efe9] to-[#eae5db] flex items-center justify-center p-6 overflow-hidden relative">
        
        {viewMode === 'mobile' ? (
          <div className="relative w-[300px] sm:w-[330px] aspect-[9/15.3] bg-luxury-dark rounded-[40px] p-2.5 shadow-2xl border-4 border-luxury-dark/95 flex flex-col justify-stretch overflow-hidden ring-1 ring-gold-medium/25 scale-[0.9] sm:scale-100 origin-center transition-all duration-500">
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
          <div className="w-full h-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl border border-gold-medium/15 flex flex-col transition-all duration-500">
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
    </div>
  );
}
