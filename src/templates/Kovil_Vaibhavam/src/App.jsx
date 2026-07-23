import React, { useEffect, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loader from './Loader';
import SitePreloader from './SitePreloader';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_INVITE_DATA = {
  showPreloader: false,
  preloaderTime: 0.7,
  groomName: "Virat Kohli",
  connector: "Weds",
  brideName: "Anushka Sharma",
  welcomeTop: "Together with Their Families",
  andText: "And",
  inviteText1: "cordially invite you and your family to join the occasion of",
  inviteText2: "their joyous wedding festivities",
  month: "November",
  dateDetails: "Sunday, 23rd November 2025",
  time: "7:45 AM - 8:45 AM",
  locationLine1: "The Grand Ballroom",
  locationLine2: "123 Wedding Avenue, New York",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  events: [
    { 
      id: 1, 
      name: "Haldi Ceremony", 
      date: "Friday, Nov 21, 2025", 
      time: "10:00 AM - 1:00 PM"
    },
    { 
      id: 2, 
      name: "Mehendi & Sangeet", 
      date: "Saturday, Nov 22, 2025", 
      time: "4:00 PM Onwards"
    },
    { 
      id: 3, 
      name: "Wedding Ceremony", 
      date: "Sunday, Nov 23, 2025", 
      time: "7:45 AM - 8:45 AM"
    },
    { 
      id: 4, 
      name: "Reception Party", 
      date: "Sunday, Nov 23, 2025", 
      time: "7:00 PM Onwards"
    }
  ],
  whatsappNumber: "1234567890",
  audioSrc: "/bg_music.mp3"
};

function App({ inviteData = {} }) {
  const data = {
    ...DEFAULT_INVITE_DATA,
    ...inviteData,
    events: (inviteData?.events && inviteData.events.length > 0) ? inviteData.events : DEFAULT_INVITE_DATA.events
  };

  const bgRef = useRef(null);
  const carouselRef = useRef(null);

  const events = (data.events || []).map((e, idx) => ({
    id: e.id || idx,
    name: e.name || e.title || `Event ${idx + 1}`,
    date: e.date || '',
    time: e.time || '',
    venue: e.venue || e.location || data.locationLine1
  }));

  const tripledEvents = [
    ...events.map((e, idx) => ({ ...e, uniqueId: `set1-${e.id}-${idx}` })),
    ...events.map((e, idx) => ({ ...e, uniqueId: `set2-${e.id}-${idx}` })),
    ...events.map((e, idx) => ({ ...e, uniqueId: `set3-${e.id}-${idx}` }))
  ];

  useEffect(() => {
    if (carouselRef.current && events.length > 0) {
      const track = carouselRef.current;
      const cardWidth = track.scrollWidth / 3;
      track.scrollLeft = cardWidth;
    }
  }, [events.length]);

  const handleScroll = () => {
    if (!carouselRef.current || events.length === 0) return;
    const track = carouselRef.current;
    const cardWidth = track.scrollWidth / 3;

    if (track.scrollLeft <= 5) {
      track.scrollLeft += cardWidth;
    } else if (track.scrollLeft >= cardWidth * 2 - 5) {
      track.scrollLeft -= cardWidth;
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {data.showPreloader && <SitePreloader duration={data.preloaderTime} />}
      <div className="app-container">
        
        {/* We moved bgRef to the wrapper so the text also parallaxes with the sky! */}
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
          {/* We wrap individual images in a relative container so absolute text aligns perfectly to them */}
          <div className="image-overlay-container">
            <img 
              src="/foreground.webp" 
              alt="Foreground" 
              className="hero-foreground" 
            />
          </div>
          
          <div className="image-overlay-container">
            <img src="/invite.webp" alt="Invite" className="invite-image" />
            <div className="invite-text-container">
              <p className="invite-welcome">{data.welcomeTop}</p>
              
              <h2 className="invite-name">{data.groomName}</h2>
              <p className="invite-and">{data.andText}</p>
              <h2 className="invite-name">{data.brideName}</h2>
              
              <div className="invite-message">
                <p>{data.inviteText1}</p>
                <p>{data.inviteText2}</p>
              </div>
              
              <div className="details-block">
                {/* DATE ROW */}
                <div className="info-row">
                  <div className="info-icon-container">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="#834701" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="8" cy="14" r="1" fill="#834701" />
                      <circle cx="12" cy="14" r="1" fill="#834701" />
                      <circle cx="16" cy="14" r="1" fill="#834701" />
                    </svg>
                  </div>
                  <div className="info-vertical-line"></div>
                  <div className="info-content">
                    <span className="info-label">DATE</span>
                    <span className="info-value">{data.dateDetails}</span>
                  </div>
                </div>

                <div className="info-row-divider">
                  <svg viewBox="0 0 200 12" width="100%" height="12">
                    <line x1="0" y1="6" x2="88" y2="6" stroke="#834701" strokeWidth="0.6" strokeDasharray="2,2" />
                    <polygon points="100,2 103,6 100,10 97,6" fill="#834701" />
                    <line x1="112" y1="6" x2="200" y2="6" stroke="#834701" strokeWidth="0.6" strokeDasharray="2,2" />
                  </svg>
                </div>

                {/* TIME ROW */}
                <div className="info-row">
                  <div className="info-icon-container">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="#834701" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 14.5" />
                    </svg>
                  </div>
                  <div className="info-vertical-line"></div>
                  <div className="info-content">
                    <span className="info-label">TIME</span>
                    <span className="info-value">{data.time}</span>
                  </div>
                </div>

                <div className="info-row-divider">
                  <svg viewBox="0 0 200 12" width="100%" height="12">
                    <line x1="0" y1="6" x2="88" y2="6" stroke="#834701" strokeWidth="0.6" strokeDasharray="2,2" />
                    <polygon points="100,2 103,6 100,10 97,6" fill="#834701" />
                    <line x1="112" y1="6" x2="200" y2="6" stroke="#834701" strokeWidth="0.6" strokeDasharray="2,2" />
                  </svg>
                </div>

                {/* VENUE ROW */}
                <div className="info-row">
                  <div className="info-icon-container">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="#834701" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="info-vertical-line"></div>
                  <div className="info-content">
                    <span className="info-label">VENUE</span>
                    <span className="info-value info-venue">
                      <span className="venue-line">{data.locationLine1}</span>
                      {data.locationLine2 && (
                        <span className="venue-line">{data.locationLine2}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="image-overlay-container">
            <img src="/canvas 1.webp" alt="Canvas 1" className="canvas-image" />
            <div className="events-section-container">
              <div className="events-carousel-wrapper">
                <button className="carousel-arrow left" onClick={scrollLeft} aria-label="Previous event">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="#834701" />
                  </svg>
                </button>
                
                <div className="events-carousel-track" ref={carouselRef} onScroll={handleScroll}>
                  {(tripledEvents || []).map((event) => (
                    <div key={event.uniqueId} className="event-card-frame">
                      <img src="/card.png" alt={event.name} className="event-card-bg" />
                      <div className="event-card-content">
                        <div className="event-card-header-zone">
                          <h3 className="event-card-name">{event.name}</h3>
                        </div>
                        
                        <div className="event-card-body-zone">
                          <p className="event-card-date">
                            <span className="event-card-label">DATE: </span>{event.date}
                          </p>
                          <p className="event-card-time">
                            <span className="event-card-label">TIME: </span>{event.time}
                          </p>
                          <p className="event-card-venue">
                            <span className="event-card-label">VENUE: </span>{event.venue || data.locationLine1}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="carousel-arrow right" onClick={scrollRight} aria-label="Next event">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="#834701" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="image-overlay-container">
            <img src="/enroute.png" alt="Enroute" className="canvas-image" />
            
            <div className="map-iframe-container">
              <iframe 
                src={data.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location"
              ></iframe>
            </div>
          </div>

          <div className="image-overlay-container">
            <img src="/end.png" alt="End" className="canvas-image" />
          </div>

          <div className="image-overlay-container">
            <img src="/Banner.png" alt="Banner" className="canvas-image" />
          </div>

        </div>

      </div>
      <Loader audioSrc={data.audioSrc} />
    </ReactLenis>
  );
}

export default App;
