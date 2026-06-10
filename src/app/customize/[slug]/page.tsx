"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Smartphone, CreditCard, MapPin, Heart, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { TEMPLATES, InviteData } from '@/data/templates';

interface PageProps {
  params: Promise<{ slug: string }>;
}

type TabType = 'couple' | 'event' | 'rsvp-story';

export default function CustomizePage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const [isNavigating, setIsNavigating] = useState(false);

  // Find template
  const template = TEMPLATES.find(t => t.slug === slug) || TEMPLATES[0];

  // Active form section tab
  const [activeTab, setActiveTab] = useState<TabType>('couple');

  // Preview frame view mode
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Mobile active layout tab switcher ('form' or 'preview')
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  // Form State initialized with template defaults
  const [formData, setFormData] = useState<InviteData>(template.defaultData);

  // Load state from localStorage on mount if it exists
  useEffect(() => {
    const saved = localStorage.getItem(`varnam_custom_${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.events && template.defaultData.events) {
          parsed.events = template.defaultData.events;
        }
        setFormData(parsed);
      } catch (e) {
        console.error("Error loading cached form data", e);
      }
    }
  }, [slug, template.defaultData.events]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Cache in localStorage
      localStorage.setItem(`varnam_custom_${slug}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddEvent = () => {
    setFormData(prev => {
      const currentEvents = prev.events || [];
      const updated = {
        ...prev,
        events: [
          ...currentEvents,
          {
            id: Date.now().toString(),
            title: `Event ${currentEvents.length + 1}`,
            date: "",
            time: "",
            location: ""
          }
        ]
      };
      localStorage.setItem(`varnam_custom_${slug}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateEvent = (id: string, field: string, value: string) => {
    setFormData(prev => {
      const currentEvents = prev.events || [];
      const updated = {
        ...prev,
        events: currentEvents.map(evt => evt.id === id ? { ...evt, [field]: value } : evt)
      };
      localStorage.setItem(`varnam_custom_${slug}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteEvent = (id: string) => {
    setFormData(prev => {
      const currentEvents = prev.events || [];
      const updated = {
        ...prev,
        events: currentEvents.filter(evt => evt.id !== id)
      };
      localStorage.setItem(`varnam_custom_${slug}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleProcedToCheckout = () => {
    setIsNavigating(true);
    // Save final state in localStorage
    localStorage.setItem(`varnam_active_slug`, slug);
    localStorage.setItem(`varnam_active_custom_data`, JSON.stringify(formData));
    
    // Redirect to Checkout page
    router.push('/checkout');
  };

  // Construct search params string for live iframe updates
  const getPreviewUrl = () => {
    const query = new URLSearchParams();
    query.set('template', slug);
    query.set('showPreloader', 'false'); // Disable preloader during live editing for speed!
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'showPreloader' && value !== undefined) {
        if (key === 'events') {
          query.set(key, JSON.stringify(value));
        } else {
          query.set(key, String(value));
        }
      }
    });

    return `/invitation/preview?${query.toString()}`;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div className="flex flex-col h-screen bg-[#f7f5f0] text-luxury-dark select-none">
      
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-gold-medium/15 px-6 md:px-12 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href={`/templates/${slug}`}
            className="p-2 border border-gold-medium/20 hover:border-gold-medium/55 rounded-full hover:bg-gold-light transition-all"
            title="Back to preview"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <div>
            <h1 className="font-sansflex font-bold text-sm sm:text-lg tracking-wide truncate max-w-[150px] sm:max-w-none">
              Customize {template.name}
            </h1>
            <p className="hidden sm:block text-[10px] text-foreground/50 uppercase tracking-widest font-sansflex font-semibold">
              Live Editing Workspace
            </p>
          </div>
        </div>

        {/* Proceed to checkout CTA */}
        <button
          onClick={handleProcedToCheckout}
          disabled={isNavigating}
          className="inline-flex items-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-xs uppercase tracking-widest font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md disabled:opacity-50 shrink-0"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isNavigating ? 'Proceeding...' : 'Proceed to Checkout'}</span>
          <span className="inline sm:hidden">{isNavigating ? '...' : 'Checkout'}</span>
        </button>
      </header>

      {/* Main Workspace split panel */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Side: Customize Form */}
        <aside className={`w-full lg:w-[480px] bg-white border-r border-gold-medium/10 flex flex-col shrink-0 overflow-hidden lg:h-full transition-all ${
          mobileView === 'form' ? 'flex-grow h-full' : 'hidden lg:flex'
        }`}>
          {/* Form Tabs */}
          <div className="flex border-b border-gold-medium/10 shrink-0">
            {[
              { id: 'couple', label: 'Names', icon: Heart },
              { id: 'event', label: 'Ceremony', icon: MapPin },
              { id: 'rsvp-story', label: 'RSVP & Story', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
                    isActive 
                      ? 'border-gold-dark text-gold-dark bg-gold-light/10 font-bold' 
                      : 'border-transparent text-foreground/45 hover:text-foreground/75'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content area (scrollable) */}
          <div data-lenis-prevent className="flex-grow overflow-y-auto p-6 space-y-6 text-left">
            
            {/* TAB 1: Couple names */}
            {activeTab === 'couple' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-sansflex text-base font-bold text-gold-dark mb-4 pb-2 border-b border-gold-medium/5">
                  Couple Details
                </h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Groom Name</label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Connector Text</label>
                  <input
                    type="text"
                    name="connector"
                    value={formData.connector}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Bride Name</label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Ceremony details */}
            {activeTab === 'event' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-sansflex text-base font-bold text-gold-dark mb-4 pb-2 border-b border-gold-medium/5">
                  Ceremony & Location
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Welcome Text</label>
                  <input
                    type="text"
                    name="welcomeTop"
                    value={formData.welcomeTop}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Wedding Month</label>
                  <input
                    type="text"
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    placeholder="e.g. NOVEMBER"
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Date & Day details</label>
                  <input
                    type="text"
                    name="dateDetails"
                    value={formData.dateDetails}
                    onChange={handleInputChange}
                    placeholder="e.g. SUNDAY | 23 | 2025"
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Wedding Time</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g. 7:45 AM - 8:45 AM"
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Venue Name</label>
                  <input
                    type="text"
                    name="locationLine1"
                    value={formData.locationLine1}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Venue Address</label>
                  <input
                    type="text"
                    name="locationLine2"
                    value={formData.locationLine2}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Google Maps Iframe Embed URL</label>
                  <input
                    type="text"
                    name="mapEmbedUrl"
                    value={formData.mapEmbedUrl}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-xs outline-none text-luxury-dark transition-all font-mono"
                  />
                  <span className="text-[10px] text-foreground/40 leading-normal font-sansflex">
                    Provide the src attribute of Google Maps embed frame (URL starting with https://www.google.com/maps/embed)
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: RSVP & Story */}
            {activeTab === 'rsvp-story' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-sansflex text-base font-bold text-gold-dark mb-4 pb-2 border-b border-gold-medium/5">
                  RSVP & Story info
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">WhatsApp RSVP Number</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 919876543210 (with country code, no + or spaces)"
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all font-mono"
                  />
                  <span className="text-[10px] text-foreground/45 leading-normal">
                    Important: Specify full number with country code without spaces (e.g. for India use 91XXXXXXXXXX) to trigger direct WhatsApp chats.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Background Music MP3 URL</label>
                  <input
                    type="text"
                    name="audioSrc"
                    value={formData.audioSrc}
                    onChange={handleInputChange}
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3 text-sm outline-none text-luxury-dark transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex justify-between items-center pb-2 border-b border-gold-medium/10">
                    <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Wedding Events</label>
                    <button
                      type="button"
                      onClick={handleAddEvent}
                      className="flex items-center gap-1 bg-gold-medium/10 hover:bg-gold-medium/20 text-gold-dark text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Event</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(!formData.events || formData.events.length === 0) ? (
                      <p className="text-[11px] text-foreground/45 text-center py-4 italic">
                        No events added yet. Click &quot;Add Event&quot; to begin.
                      </p>
                    ) : (
                      formData.events.map((evt, idx) => (
                        <div 
                          key={evt.id} 
                          className="bg-gold-light/5 border border-gold-medium/10 rounded-xl p-3.5 space-y-3 relative"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-sansflex font-bold text-luxury-dark/70 uppercase tracking-widest">
                              Event #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="text-foreground/40 hover:text-red-600 transition-colors p-1"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase tracking-wider font-semibold text-foreground/50">Event Title</span>
                              <input
                                type="text"
                                value={evt.title}
                                onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                                placeholder="e.g. Sangeet Ceremony"
                                className="w-full bg-white border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-lg px-3 py-1.5 text-xs outline-none text-luxury-dark transition-all"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-wider font-semibold text-foreground/50">Date</span>
                                <input
                                  type="text"
                                  value={evt.date}
                                  onChange={(e) => handleUpdateEvent(evt.id, 'date', e.target.value)}
                                  placeholder="e.g. Saturday, 22 Nov"
                                  className="w-full bg-white border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-lg px-3 py-1.5 text-xs outline-none text-luxury-dark transition-all"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-wider font-semibold text-foreground/50">Time</span>
                                <input
                                  type="text"
                                  value={evt.time}
                                  onChange={(e) => handleUpdateEvent(evt.id, 'time', e.target.value)}
                                  placeholder="e.g. 7:00 PM onwards"
                                  className="w-full bg-white border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-lg px-3 py-1.5 text-xs outline-none text-luxury-dark transition-all"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase tracking-wider font-semibold text-foreground/50">Venue / Location</span>
                              <input
                                type="text"
                                value={evt.location}
                                onChange={(e) => handleUpdateEvent(evt.id, 'location', e.target.value)}
                                placeholder="e.g. THE GRAND BALLROOM"
                                className="w-full bg-white border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-lg px-3 py-1.5 text-xs outline-none text-luxury-dark transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Spacing element at the bottom to prevent layout overlap with floating mobile switcher */}
            <div className="h-24 lg:hidden" />
          </div>
        </aside>

        {/* Right Side: Iframe Live Preview Panel */}
        <main className={`flex-grow bg-gradient-to-br from-[#f2efe9] to-[#eae5db] flex flex-col lg:h-full overflow-hidden p-6 ${
          mobileView === 'preview' ? 'flex-grow h-full' : 'hidden lg:flex'
        }`}>
          {/* Preview Viewport Switcher */}
          <div className="flex justify-between items-center mb-4 shrink-0">
            <span className="text-xs uppercase tracking-wider font-semibold text-foreground/50 font-sansflex">
              Real-time Live Preview
            </span>
            <div className="flex items-center gap-1.5 bg-white border border-gold-medium/15 p-1 rounded-full shadow-sm">
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all ${
                  previewMode === 'mobile'
                    ? 'bg-luxury-dark text-gold-light'
                    : 'text-foreground/50 hover:text-gold-dark'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all ${
                  previewMode === 'desktop'
                    ? 'bg-luxury-dark text-gold-light'
                    : 'text-foreground/50 hover:text-gold-dark'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            {previewMode === 'mobile' ? (
              <div className="relative w-[300px] sm:w-[330px] aspect-[9/15.3] bg-luxury-dark rounded-[40px] p-2.5 shadow-2xl border-4 border-luxury-dark/95 flex flex-col justify-stretch overflow-hidden ring-1 ring-gold-medium/25 scale-[0.9] sm:scale-100 origin-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-luxury-dark rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-800 ml-2" />
                  <div className="w-10 h-0.5 bg-neutral-800 rounded-full ml-3" />
                </div>
                <div className="w-full h-full rounded-[30px] overflow-hidden bg-white relative z-20">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Live Mobile Customization Preview"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-gold-medium/10 flex flex-col max-w-5xl">
                <div className="h-6 bg-neutral-100 border-b border-neutral-200 px-4 flex items-center gap-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                </div>
                <div className="flex-grow bg-white">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Live Desktop Customization Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </main>

      </div>

      {/* Mobile Floating Tab Switcher */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gold-medium/20 shadow-xl rounded-full p-1 flex gap-1.5 z-50">
        <button
          onClick={() => setMobileView('form')}
          className={`px-4.5 py-2.5 rounded-full text-xs font-sansflex uppercase tracking-wider font-semibold transition-all ${
            mobileView === 'form'
              ? 'bg-luxury-dark text-gold-light shadow-md'
              : 'text-foreground/50 hover:text-gold-dark'
          }`}
        >
          Edit Details
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`px-4.5 py-2.5 rounded-full text-xs font-sansflex uppercase tracking-wider font-semibold transition-all ${
            mobileView === 'preview'
              ? 'bg-luxury-dark text-gold-light shadow-md'
              : 'text-foreground/50 hover:text-gold-dark'
          }`}
        >
          Live Preview
        </button>
      </div>
    </div>
  );
}
