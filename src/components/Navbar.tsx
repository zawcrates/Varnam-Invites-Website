"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("current_user");
    setCurrentUser(null);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("current_user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize to desktop sizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 flex items-center transition-all duration-500 ${
          isScrolled 
            ? 'h-[70px] md:h-[90px] bg-white/70 backdrop-blur-md border-b border-gold-medium/10 shadow-sm' 
            : 'h-[100px] md:h-[146px] bg-transparent'
        }`}
      >
        <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 px-6 md:px-12 flex justify-center items-center h-full">
          
          {/* Hamburger Menu Toggle Button (Left aligned, bold 3 lines morphing into X) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute left-3 sm:left-4 md:left-12 z-50 w-8 h-6 flex flex-col justify-center items-center focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="relative w-8 h-5 flex flex-col justify-between">
              <span 
                className={`w-8 h-[4px] bg-black transition-all duration-350 transform origin-center ${
                  isOpen ? 'rotate-45 translate-y-[8.5px]' : ''
                }`}
              />
              <span 
                className={`w-8 h-[4px] bg-black transition-all duration-350 transform origin-center ${
                  isOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span 
                className={`w-8 h-[4px] bg-black transition-all duration-350 transform origin-center ${
                  isOpen ? '-rotate-45 -translate-y-[7.5px]' : ''
                }`}
              />
            </div>
          </button>
 
          {/* Brand Logo Link Centered */}
          <Link href="/" onClick={handleLogoClick} className="flex items-center justify-center group z-40">
            <img 
              src="/Varnam_svg3.png" 
              alt="Varnam Invites Logo" 
              className={`w-auto object-contain transition-all duration-500 group-hover:scale-[1.03] h-24 sm:h-44 origin-center ${
                isScrolled 
                  ? 'scale-[0.7] sm:scale-[0.8] translate-y-[2px] sm:translate-y-[10px]' 
                  : 'scale-100 translate-y-[8px] sm:translate-y-[15px]'
              }`}
            />
          </Link>

          {/* Log In / Profile (Right aligned) */}
          {currentUser ? (
            <div className="absolute right-3 sm:right-4 md:right-12 z-40 flex items-center" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="focus:outline-none cursor-pointer group"
                title="Profile Menu"
              >
                <div
                  className="w-11 h-11 rounded-full bg-white/45 backdrop-blur-md border border-gold-medium/30 flex items-center justify-center text-luxury-dark transition-all duration-300 group-hover:scale-105 group-hover:bg-white/60 shadow-sm shadow-luxury-dark/5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-dark/80 group-hover:text-luxury-dark"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/75 backdrop-blur-xl border border-gold-medium/25 rounded-xl shadow-xl shadow-luxury-dark/15 overflow-hidden flex flex-col py-1.5 text-left"
                  >
                    <div className="px-4 py-2 border-b border-gold-medium/10">
                      <p className="text-[9px] uppercase tracking-widest text-luxury-dark/40 font-sansflex font-bold">Signed in as</p>
                      <p className="text-xs font-bold text-luxury-dark truncate font-sansflex">{currentUser.name}</p>
                    </div>
                    <Link
                      href="/my-invites"
                      onClick={() => setShowDropdown(false)}
                      className="px-4 py-2.5 text-xs text-left font-sansflex font-semibold text-luxury-dark hover:bg-gold-light/25 hover:text-gold-dark transition-all duration-200 flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-dark"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      My Invites
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2.5 text-xs text-left font-sansflex font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border-t border-gold-medium/5 flex items-center gap-2 cursor-pointer w-full"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="absolute right-6 md:right-12 z-40 inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-gold-medium/30 bg-white/20 hover:bg-luxury-dark text-luxury-dark hover:text-gold-light font-sansflex text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-pointer"
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      {/* Slide-out Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Full-screen Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 w-screen h-screen z-40 bg-white/70 backdrop-blur-xl text-luxury-dark flex flex-col p-8 sm:p-12 justify-between"
            >
              {/* Spacing element to push links below the fixed navbar */}
              <div className="h-[146px] w-full" />

              {/* Centered Large Navigation Links */}
              <div className="flex flex-col items-center justify-center flex-grow">
                <nav className="flex flex-col gap-8 text-center">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'Browse Templates', href: '/templates' },
                    { name: 'Contact Us', href: '/#contact' },
                  ].map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="font-sansflex text-2xl sm:text-3xl md:text-4xl tracking-widest text-luxury-dark hover:text-gold-dark transition-colors duration-300 block py-2 uppercase"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {currentUser && (
                <div className="flex flex-col items-center gap-2 mb-4 font-sansflex">
                  <span className="text-[10px] text-luxury-dark/40 uppercase tracking-widest font-semibold">Logged In As</span>
                  <span className="text-base font-bold text-luxury-dark uppercase tracking-wide">{currentUser.name}</span>
                  
                  <div className="flex gap-4 items-center mt-1">
                    <Link
                      href="/my-invites"
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-gold-dark hover:text-gold-medium font-bold uppercase tracking-wider transition-colors py-1.5 px-4 border border-gold-medium/30 rounded-full hover:bg-gold-light/25"
                    >
                      My Invites
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-bold uppercase tracking-wider transition-colors py-1.5 px-4 border border-red-200 rounded-full hover:bg-red-50 cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}

              {/* Centered Drawer Footer */}
              <div className="flex flex-col items-center gap-6 border-t border-gold-medium/10 pt-8 w-full max-w-md mx-auto text-center">
                <div className="flex flex-col gap-1.5 text-xs text-luxury-dark/60 font-sansflex">
                  <span>support@varnaminvites.com</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="text-[10px] text-luxury-dark/40 font-sansflex tracking-wide">
                  &copy; {new Date().getFullYear()} Varnam Invites. All rights reserved.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          setShowLogin(false);
        }} 
      />
    </>
  );
}
