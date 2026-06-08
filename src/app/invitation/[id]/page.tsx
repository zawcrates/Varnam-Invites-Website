"use client";

import React, { useState, useEffect, use } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderers';
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

  return <TemplateRenderer slug={templateSlug} inviteData={inviteData} />;
}
