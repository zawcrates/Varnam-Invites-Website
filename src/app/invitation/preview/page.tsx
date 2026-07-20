"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTemplateRenderer } from '@/templates';
import { InviteData } from '@/data/templates';

function InvitationPreviewContent() {
  const searchParams = useSearchParams();
  
  // Extract parameters
  const templateSlug = searchParams.get('template') || 'vintage-parchment';
  
  const eventsParam = searchParams.get('events');
  let parsedEvents = undefined;
  if (eventsParam) {
    try {
      parsedEvents = JSON.parse(eventsParam);
    } catch (e) {
      console.error("Failed to parse events JSON parameter", e);
    }
  }

  // Reconstruct inviteData
  const inviteData: Partial<InviteData> = {
    showPreloader: searchParams.get('showPreloader') === 'true',
    preloaderTime: parseFloat(searchParams.get('preloaderTime') || '0.7'),
    groomName: searchParams.get('groomName') || undefined,
    connector: searchParams.get('connector') || undefined,
    brideName: searchParams.get('brideName') || undefined,
    welcomeTop: searchParams.get('welcomeTop') || undefined,
    andText: searchParams.get('andText') || undefined,
    inviteText1: searchParams.get('inviteText1') || undefined,
    inviteText2: searchParams.get('inviteText2') || undefined,
    month: searchParams.get('month') || undefined,
    dateDetails: searchParams.get('dateDetails') || undefined,
    time: searchParams.get('time') || undefined,
    locationLine1: searchParams.get('locationLine1') || undefined,
    locationLine2: searchParams.get('locationLine2') || undefined,
    mapEmbedUrl: searchParams.get('mapEmbedUrl') || undefined,
    storyText: searchParams.get('storyText') || undefined,
    whatsappNumber: searchParams.get('whatsappNumber') || undefined,
    audioSrc: searchParams.get('audioSrc') || undefined,
    events: parsedEvents,
  };

  const Renderer = getTemplateRenderer(templateSlug);

  if (!Renderer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-neutral-400 p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Template Not Found</h2>
        <p className="text-sm">The requested template layout does not exist.</p>
      </div>
    );
  }

  return <Renderer inviteData={inviteData} />;
}

export default function InvitationPreviewPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#fdfbf7] text-[#834701] font-serif text-lg tracking-widest">
          Loading Preview...
        </div>
      }
    >
      <InvitationPreviewContent />
    </Suspense>
  );
}
