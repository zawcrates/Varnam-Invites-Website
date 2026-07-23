import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SitePreloader = ({ duration = 0.8 }) => {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Ensure duration doesn't exceed the max of 1.2 seconds
    const safeDuration = Math.min(duration, 1.3);
    const fadeWaitTime = safeDuration * 1000;

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, fadeWaitTime);

    // Remove from DOM after transition completes
    const removeTimer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = 'unset';
    }, fadeWaitTime + 800); // fadeWaitTime + 800ms transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = 'unset';
    };
  }, [duration]);

  if (!loading) return null;

  return (
    <PreloaderContainer $fade={fade} $animationDuration={Math.min(duration, 1.3) + 1.5}>
      <picture>
        <source media="(max-width: 768px)" srcSet="/preloader_mobile.webp" />
        <img src="/preloader_desktop.webp" alt="Loading..." />
      </picture>
    </PreloaderContainer>
  );
};

const PreloaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* Fallback */
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  z-index: 9999;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
  opacity: ${props => (props.$fade ? 0 : 1)};
  pointer-events: ${props => (props.$fade ? 'none' : 'auto')};
  user-select: none;
  
  picture {
    width: 100%;
    height: 100%;
    display: block;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center; /* Keeps the focus centered on all aspect ratios */
    pointer-events: none; /* Prevents long-press save image on mobile */
    animation: preloaderZoomOut ${props => props.$animationDuration}s ease-out forwards;
  }

  @keyframes preloaderZoomOut {
    0% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default SitePreloader;
