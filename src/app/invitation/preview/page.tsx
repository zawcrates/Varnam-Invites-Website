"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TemplateRenderer from '@/components/templates/TemplateRenderers';
import { InviteData } from '@/data/templates';

function InvitationPreviewContent() {
  const searchParams = useSearchParams();
  
  // Extract parameters
  const templateSlug = searchParams.get('template') || 'vintage-parchment';
  
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
  };

  return <TemplateRenderer slug={templateSlug} inviteData={inviteData} />;
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
