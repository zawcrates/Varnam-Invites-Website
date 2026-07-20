"use client";

import React, { useState, useEffect, use } from 'react';
import { getTemplateRenderer } from '@/templates';
import { InviteData, TEMPLATES } from '@/data/templates';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvitationViewPage({ params }: PageProps) {
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [templateSlug, setTemplateSlug] = useState('vintage-parchment');
  const [inviteData, setInviteData] = useState<Partial<InviteData>>({});

  useEffect(() => {
    // Read from published registry
    const published = JSON.parse(localStorage.getItem('varnam_published_invitations') || '{}');
    const record = published[id];

    if (record) {
      setTemplateSlug(record.templateSlug);
      setInviteData(record.inviteData);
    } else {
      // Fallback: If visited on other devices without local storage record,
      // load the first template default data so the page displays a beautiful fallback invite
      const defaultTemplate = TEMPLATES[0];
      setTemplateSlug(defaultTemplate.slug);
      setInviteData(defaultTemplate.defaultData);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdfbf7] text-[#834701] font-serif text-lg tracking-widest">
        Opening Celebration...
      </div>
    );
  }

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
