"use client";

import React, { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Smartphone, ExternalLink, Sliders } from 'lucide-react';
import { TEMPLATES } from '@/data/templates';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TemplateDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  
  // Find current template
  const template = TEMPLATES.find(t => t.slug === slug) || TEMPLATES[0];
  
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');

  // Preview URL for the iframe
  const previewUrl = `/invitation/preview?template=${template.slug}`;

  return (
    <div className="flex flex-col h-screen bg-[#f7f5f0] text-luxury-dark select-none">
      
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
          <div>
            <h1 className="font-sansflex font-bold text-base sm:text-lg tracking-wide">
              {template.name}
            </h1>
            <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-sansflex font-semibold">
              ₹{template.price} &bull; {template.category} Style
            </p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden sm:flex items-center gap-2 bg-gold-light/40 border border-gold-medium/15 p-1 rounded-full">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
              viewMode === 'mobile'
                ? 'bg-luxury-dark text-gold-light shadow-md'
                : 'text-foreground/50 hover:text-gold-dark'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile view</span>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
              viewMode === 'desktop'
                ? 'bg-luxury-dark text-gold-light shadow-md'
                : 'text-foreground/50 hover:text-gold-dark'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop view</span>
          </button>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          {/* External Tab */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gold-medium/20 hover:border-gold-medium/50 hover:bg-gold-light rounded-full text-foreground/80 hover:text-gold-dark transition-all shrink-0"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          
          {/* Primary CTA */}
          <Link
            href={`/customize/${template.slug}`}
            className="inline-flex items-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-xs uppercase tracking-widest font-semibold px-5 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize</span>
          </Link>
        </div>

      </header>

      {/* Main View Area */}
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#f2efe9] to-[#eae5db]">
        {viewMode === 'mobile' ? (
          /* Phone Frame mockup */
          <div className="relative w-[340px] sm:w-[370px] aspect-[9/18.5] bg-luxury-dark rounded-[48px] p-3 shadow-2xl border-4 border-luxury-dark/95 flex flex-col justify-stretch overflow-hidden ring-1 ring-gold-medium/20 animate-fade-in">
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-luxury-dark rounded-b-2xl z-30 flex items-center justify-center">
              {/* Camera Lens */}
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 ml-4" />
              {/* Speaker Grill */}
              <div className="w-12 h-1 bg-neutral-800 rounded-full ml-4" />
            </div>

            {/* Home indicator bar (bottom) */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-800 rounded-full z-30 pointer-events-none" />

            {/* Web View Inside Mobile Frame */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-white relative z-20">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title={`${template.name} Mobile Preview`}
              />
            </div>
          </div>
        ) : (
          /* Full Desktop Iframe view */
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-xl border border-gold-medium/10 max-w-6xl mx-auto flex flex-col animate-fade-in">
            {/* Desktop browser bar */}
            <div className="h-8 bg-neutral-100/80 border-b border-neutral-200 px-4 flex items-center gap-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
              <div className="bg-neutral-200/50 text-[10px] text-foreground/40 font-sansflex tracking-wide px-4 py-0.5 rounded-md ml-4 w-64 truncate">
                varnaminvites.com/preview/{template.slug}
              </div>
            </div>
            {/* Iframe */}
            <div className="flex-grow bg-white">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title={`${template.name} Desktop Preview`}
              />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
