"use client";

import React from 'react';
import VintageParchmentTemplate from './vintage-parchment/VintageParchmentTemplate';
import RoyalHeritageTemplate from './royal-heritage/RoyalHeritageTemplate';
import { InviteData } from '@/data/templates';

interface TemplateRendererProps {
  slug: string;
  inviteData: Partial<InviteData>;
}

export default function TemplateRenderer({ slug, inviteData }: TemplateRendererProps) {
  switch (slug) {
    case 'vintage-parchment':
      return <VintageParchmentTemplate inviteData={inviteData} />;
    case 'royal-heritage':
      return <RoyalHeritageTemplate inviteData={inviteData} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-neutral-400 p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Template Not Found</h2>
          <p className="text-sm">The requested template layout does not exist.</p>
        </div>
      );
  }
}
