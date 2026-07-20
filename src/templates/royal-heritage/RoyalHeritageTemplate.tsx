"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Calendar, Clock, VolumeX, Volume2 } from 'lucide-react';
import { InviteData } from '@/data/templates';

interface RoyalHeritageTemplateProps {
  inviteData: Partial<InviteData>;
}

export default function RoyalHeritageTemplate({ inviteData }: RoyalHeritageTemplateProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const data: InviteData = {
    showPreloader: inviteData.showPreloader !== undefined ? inviteData.showPreloader : true,
    preloaderTime: inviteData.preloaderTime !== undefined ? inviteData.preloaderTime : 0.7,
    groomName: inviteData.groomName || "Ranveer Singh",
    connector: inviteData.connector || "Weds",
    brideName: inviteData.brideName || "Deepika Padukone",
    welcomeTop: inviteData.welcomeTop || "WITH THE BLESSINGS OF ALMIGHTY AND ANCESTORS",
    andText: inviteData.andText || "AND",
    inviteText1: inviteData.inviteText1 || "humbly solicit your gracious presence at the wedding ceremony of",
    inviteText2: inviteData.inviteText2 || "their beloved children",
    month: inviteData.month || "DECEMBER",
    dateDetails: inviteData.dateDetails || "WEDNESDAY | 18 | 2026",
    time: inviteData.time || "6:00 PM onwards",
    locationLine1: inviteData.locationLine1 || "THE PALACE PALAZZO",
    locationLine2: inviteData.locationLine2 || "JAIPUR ROAD, RAJASTHAN",
    mapEmbedUrl: inviteData.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    storyText: inviteData.storyText || "Two hearts bound by love, celebrating a union of two families. We invite you to bless our union as we take our sacred vows in the royal heritage of Rajasthan.",
    whatsappNumber: inviteData.whatsappNumber || "9876543210",
    audioSrc: inviteData.audioSrc || "/bg_music.mp3",
    events: inviteData.events || undefined
  };

  // Auto scroll and active event index state for carousel
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const eventsList = data.events && data.events.length > 0 ? data.events : [
    {
      id: "default-wedding",
      title: "Wedding Ceremony",
      date: data.dateDetails || "WEDNESDAY | 18 | 2026",
      time: data.time || "6:00 PM onwards",
      location: `${data.locationLine1 || "THE PALACE PALAZZO"}${data.locationLine2 ? `, ${data.locationLine2}` : ""}`
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
    let hasPlayed = false;
    const attemptPlay = () => {
      if (!audioRef.current || hasPlayed) return;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        hasPlayed = true;
        cleanupListeners();
      }).catch(() => {});
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
    };

    attemptPlay();
    window.addEventListener('click', attemptPlay);
    window.addEventListener('touchstart', attemptPlay);
    window.addEventListener('scroll', attemptPlay);

    return cleanupListeners;
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#651010] text-[#fdf6e2] relative overflow-hidden font-sansflex">
      <audio ref={audioRef} src={data.audioSrc} autoPlay loop style={{ display: 'none' }} />
      
      {/* Decorative Traditional Mandalas */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full border-4 border-[#c5a880]/20 opacity-30 flex items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-full border-2 border-[#c5a880]/30 border-dashed animate-spin-[120s_linear_infinite]" />
      </div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full border-4 border-[#c5a880]/20 opacity-30 flex items-center justify-center">
        <div className="w-[200px] h-[200px] rounded-full border-2 border-[#c5a880]/30 border-dashed animate-spin-[120s_linear_infinite]" />
      </div>

      <div className="w-full mx-auto px-6 py-12 flex flex-col justify-center items-center min-h-screen relative z-10 text-center">
        
        {/* Golden Arch Border */}
        <div className="border-2 border-[#c5a880] rounded-[50px_50px_0_0] px-4 py-12 md:px-8 md:py-16 w-full bg-[#520d0d]/80 backdrop-blur-sm shadow-2xl relative">
          
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border border-[#c5a880]/40 rounded-[44px_44px_0_0] pointer-events-none" />

          {/* Traditional Blessings Header */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#c5a880] mb-8 font-sansflex"
          >
            {data.welcomeTop}
          </motion.p>

          {/* Groom Name */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-[#f3e1b7] tracking-wider mb-2 font-sansflex"
          >
            {data.groomName}
          </motion.h1>

          {/* Connector */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl italic text-[#c5a880] my-2 font-sansflex"
          >
            {data.connector}
          </motion.div>

          {/* Bride Name */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold text-[#f3e1b7] tracking-wider mb-8 font-sansflex"
          >
            {data.brideName}
          </motion.h1>

          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mb-8" />

          {/* Wedding Invite Info Text */}
          <p className="text-sm md:text-base italic text-[#ebdcb9] max-w-[80%] mx-auto leading-relaxed mb-8">
            {data.inviteText1} <span className="font-bold text-[#f3e1b7]">{data.inviteText2}</span>
          </p>

          {/* Date details */}
          <div className="bg-[#651010]/90 border border-[#c5a880]/30 rounded-xl p-6 md:p-8 mb-8 flex flex-col items-center w-full">
            <Calendar className="w-6 h-6 text-[#c5a880] mb-2" />
            <h3 className="text-xl md:text-2xl uppercase tracking-widest text-[#f3e1b7] font-semibold mb-1">
              {data.month}
            </h3>
            <p className="text-sm md:text-base tracking-wider text-[#ebdcb9]">
              {data.dateDetails}
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs md:text-sm text-[#c5a880] font-sansflex">
              <Clock className="w-3.5 h-3.5" />
              <span>{data.time}</span>
            </div>
          </div>

          {/* Venue Location details */}
          <div className="flex flex-col items-center mb-8 px-4">
            <MapPin className="w-6 h-6 text-[#c5a880] mb-2" />
            <h4 className="text-sm md:text-base font-semibold tracking-wider text-[#f3e1b7] uppercase mb-1">
              {data.locationLine1}
            </h4>
            <p className="text-xs md:text-sm text-[#ebdcb9] leading-relaxed">
              {data.locationLine2}
            </p>
          </div>

          {/* Events Section */}
          <div className="border-t border-[#c5a880]/20 pt-8 mt-8 w-full px-4 relative">
            <h4 className="text-[#c5a880] text-xs md:text-sm uppercase tracking-[0.2em] font-sansflex mb-6">Wedding Events</h4>
            <div className="w-full overflow-hidden relative px-4">
              {totalEvents > 1 && (
                <>
                  <button 
                    onClick={() => handleArrowClick('prev')} 
                    className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#520d0d]/90 border border-[#c5a880]/40 text-[#f3e1b7] hover:text-white flex items-center justify-center z-10 shadow-lg transition-transform active:scale-95"
                    aria-label="Previous event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleArrowClick('next')} 
                    className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#520d0d]/90 border border-[#c5a880]/40 text-[#f3e1b7] hover:text-white flex items-center justify-center z-10 shadow-lg transition-transform active:scale-95"
                    aria-label="Next event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}
              <div 
                className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-visible snap-x snap-mandatory gap-4 pb-4 md:pb-0 scrollbar-none justify-start md:items-center"
                ref={containerRef}
              >
                {eventsList.map((evt, idx) => (
                  <div 
                    key={evt.id} 
                    ref={el => { cardRefs.current[idx] = el; }}
                    className="flex-shrink-0 w-full md:w-full max-w-md snap-center bg-[#520d0d]/90 border-2 border-[#c5a880]/80 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.35)] hover:scale-[1.02] transition-all duration-300"
                  >
                    <h5 className="text-lg font-bold text-[#f3e1b7] mb-2 tracking-wide uppercase font-sansflex">{evt.title}</h5>
                    <div className="w-12 h-[1px] bg-[#c5a880]/40 mb-3" />
                    {evt.date && <p className="text-sm text-[#ebdcb9] tracking-wider mb-1 font-sansflex">{evt.date}</p>}
                    {evt.time && <p className="text-xs text-[#c5a880] mb-2 font-sansflex">{evt.time}</p>}
                    {evt.location && <p className="text-xs text-[#ebdcb9]/80 italic font-sansflex leading-relaxed">{evt.location}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden border border-[#c5a880]/30 my-8 opacity-90 shadow-md">
            <iframe 
              src={data.mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              title="Venue Location Map"
            ></iframe>
          </div>

          {/* WhatsApp RSVP */}
          <a
            href={`https://wa.me/${data.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1b7937] hover:bg-[#16602c] text-white font-sansflex text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>RSVP via WhatsApp</span>
          </a>

        </div>

      </div>

      {/* Floating Audio Controller */}
      <button 
        onClick={toggleMusic}
        className="fixed bottom-10 right-10 z-[100] cursor-pointer bg-[#c5a880] hover:bg-[#ebdcb9] text-[#520d0d] p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </div>
  );
}
