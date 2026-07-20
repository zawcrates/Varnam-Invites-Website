"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VintageParchmentLoader from './VintageParchmentLoader';
import VintageParchmentWhatsappButton from './VintageParchmentWhatsappButton';
import { InviteData } from '@/data/templates';
import './VintageParchment.css';

gsap.registerPlugin(ScrollTrigger);

interface VintageParchmentTemplateProps {
  inviteData: Partial<InviteData>;
}

export default function VintageParchmentTemplate({ inviteData }: VintageParchmentTemplateProps) {
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll and active event index state
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fallbacks in case individual fields are missing
  const data: InviteData = {
    showPreloader: inviteData.showPreloader !== undefined ? inviteData.showPreloader : true,
    preloaderTime: inviteData.preloaderTime !== undefined ? inviteData.preloaderTime : 0.7,
    groomName: inviteData.groomName || "Virat Kohli",
    connector: inviteData.connector || "Weds",
    brideName: inviteData.brideName || "Anushka Sharma",
    welcomeTop: inviteData.welcomeTop || "TOGETHER WITH THEIR FAMILIES",
    andText: inviteData.andText || "AND",
    inviteText1: inviteData.inviteText1 || "cordially invite you and your family to join the occasion of",
    inviteText2: inviteData.inviteText2 || "their joyous wedding festivities",
    month: inviteData.month || "NOVEMBER",
    dateDetails: inviteData.dateDetails || "SUNDAY | 23 | 2025",
    time: inviteData.time || "7:45 AM - 8:45 AM",
    locationLine1: inviteData.locationLine1 || "THE GRAND BALLROOM",
    locationLine2: inviteData.locationLine2 || "123 WEDDING AVENUE, NEW YORK",
    mapEmbedUrl: inviteData.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    storyText: inviteData.storyText || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    whatsappNumber: inviteData.whatsappNumber || "1234567890",
    audioSrc: inviteData.audioSrc || "/bg_music.mp3",
    events: inviteData.events || undefined
  };

  const eventsList = data.events && data.events.length > 0 ? data.events : [
    {
      id: "default-wedding",
      title: "Wedding Ceremony",
      date: data.dateDetails || "SUNDAY | 23 | 2025",
      time: data.time || "7:45 AM - 8:45 AM",
      location: `${data.locationLine1 || "THE GRAND BALLROOM"}${data.locationLine2 ? `, ${data.locationLine2}` : ""}`
    }
  ];

  const totalEvents = eventsList.length;
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    stopAutoScroll();
    if (totalEvents <= 1) return;
    autoScrollTimer.current = setInterval(() => {
      setActiveEventIndex(prev => (prev + 1) % totalEvents);
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalEvents]);

  const handleArrowClick = (direction: 'prev' | 'next') => {
    stopAutoScroll();
    setActiveEventIndex(prev => {
      let nextIdx = direction === 'next' ? prev + 1 : prev - 1;
      if (nextIdx >= totalEvents) nextIdx = 0;
      if (nextIdx < 0) nextIdx = totalEvents - 1;
      return nextIdx;
    });
    // Restart auto-scroll after a short delay
    setTimeout(startAutoScroll, 3000);
  };

  useEffect(() => {
    if (containerRef.current && cardRefs.current[activeEventIndex]) {
      const card = cardRefs.current[activeEventIndex];
      if (card) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeEventIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: '.background-wrapper',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div className="vintage-template-body">
        
        <div className="app-container">
          {/* Background wrapper for parallax mountain sky */}
          <div className="background-wrapper" ref={bgRef}>
            <img 
              src="/background.webp" 
              alt="Background" 
              className="hero-background" 
            />
            <div className="hero-names-container">
              <h1 className="editable-text name-primary">{data.groomName}</h1>
              <h2 className="editable-text name-connector">{data.connector}</h2>
              <h1 className="editable-text name-primary">{data.brideName}</h1>
            </div>
          </div>

          <div className="foreground-wrapper">
            {/* Foreground elements */}
            <div className="image-overlay-container">
              <img 
                src="/foreground.webp" 
                alt="Foreground" 
                className="hero-foreground" 
              />
            </div>
            
            <div className="image-overlay-container">
              <img src="/invite.webp" alt="Invite parchment" className="invite-image" />
              
              <div className="invite-text-container">
                <p className="invite-welcome">{data.welcomeTop}</p>
                
                <h2 className="invite-name">{data.groomName}</h2>
                <p className="invite-and">{data.andText}</p>
                <h2 className="invite-name">{data.brideName}</h2>
                
                <div className="invite-message">
                  <p>{data.inviteText1}</p>
                  <p>{data.inviteText2}</p>
                </div>
                
                <p className="invite-month">{data.month}</p>
                <p className="invite-date">{data.dateDetails}</p>
                <p className="invite-time">{data.time}</p>
                
                <div className="invite-location">
                  <p>{data.locationLine1}</p>
                  <p>{data.locationLine2}</p>
                </div>
              </div>
            </div>
            
            <div className="image-overlay-container">
              <img src="/canvas 1.webp" alt="Canvas background" className="canvas-image" />
              <div className="story-text-container">
                <div className="events-container">
                  {totalEvents > 1 && (
                    <>
                      <button 
                        onClick={() => handleArrowClick('prev')} 
                        className="events-nav-arrow events-nav-arrow-left"
                        aria-label="Previous event"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleArrowClick('next')} 
                        className="events-nav-arrow events-nav-arrow-right"
                        aria-label="Next event"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </>
                  )}
                  <div className="events-cards-scroll" ref={containerRef}>
                    {eventsList.map((evt, idx) => (
                      <div 
                        key={evt.id} 
                        className="event-card"
                        ref={el => { cardRefs.current[idx] = el; }}
                      >
                        <h3 className="event-card-title">{evt.title}</h3>
                        <div className="event-card-divider" />
                        {evt.date && <p className="event-card-date">{evt.date}</p>}
                        {evt.time && <p className="event-card-time">{evt.time}</p>}
                        {evt.location && <p className="event-card-location">{evt.location}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="image-overlay-container">
              <img src="/canvas 3.webp" alt="Map scroll" className="canvas-image" />
              
              <div className="map-iframe-container">
                <iframe 
                  src={data.mapEmbedUrl}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Event Location"
                ></iframe>
              </div>
              
              <VintageParchmentWhatsappButton whatsappNumber={data.whatsappNumber} />
            </div>

          </div>

        </div>
        
        {data.audioSrc && <VintageParchmentLoader audioSrc={data.audioSrc} />}
      </div>
    </ReactLenis>
  );
}
