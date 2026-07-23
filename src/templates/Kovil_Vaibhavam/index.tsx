'use client';

import React from 'react';
import type { TemplateRendererProps } from '@/templates';
import App from './src/App';
import './src/index.css';

export default function KovilVaibhavam({ inviteData }: TemplateRendererProps) {
  return <App inviteData={inviteData} />;
}
