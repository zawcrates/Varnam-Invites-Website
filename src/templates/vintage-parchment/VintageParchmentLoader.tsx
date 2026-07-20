"use client";

import React, { useState, useRef, useEffect } from 'react';

interface LoaderProps {
  audioSrc: string;
}

export default function VintageParchmentLoader({ audioSrc }: LoaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let hasPlayed = false;

    const attemptPlay = () => {
      if (!audioRef.current || hasPlayed) return;
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        hasPlayed = true;
        cleanupListeners();
      }).catch(() => {
        console.log("Autoplay waiting for user interaction...");
      });
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
    };

    // Try immediately
    attemptPlay();

    // If blocked, wait for ANY interaction
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
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className="audio-loader-wrapper" 
      onClick={toggleMusic}
    >
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        autoPlay 
        loop 
        style={{ display: 'none' }} 
      />
      
      <div className="audio-loader-container">
        <span className={`audio-bar ${isPlaying ? 'audio-bar-playing' : 'audio-bar-paused'}`} />
        <span className={`audio-bar ${isPlaying ? 'audio-bar-playing' : 'audio-bar-paused'}`} />
        <span className={`audio-bar ${isPlaying ? 'audio-bar-playing' : 'audio-bar-paused'}`} />
      </div>
    </div>
  );
}
