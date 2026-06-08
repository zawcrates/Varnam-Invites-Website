"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
        className={`fixed top-0 left-0 w-full z-50 flex items-center transition-all duration-500 overflow-hidden ${
          isScrolled 
            ? 'h-[90px] bg-white/70 backdrop-blur-md border-b border-gold-medium/10 shadow-sm' 
            : 'h-[146px] bg-transparent'
        }`}
      >
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-center items-center h-full">
          
          {/* Hamburger Menu Toggle Button (Left aligned, bold 3 lines morphing into X) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute left-6 md:left-12 z-50 w-8 h-6 flex flex-col justify-center items-center focus:outline-none cursor-pointer"
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
              className={`w-auto object-contain transition-all duration-500 group-hover:scale-[1.03] h-30 sm:h-50 translate-y-[15px] origin-center ${
                isScrolled ? 'scale-[0.8]' : 'scale-100'
              }`}
            />
          </Link>

          {/* Log In Button (Right aligned) */}
          <button
            onClick={() => setShowLogin(true)}
            className="absolute right-6 md:right-12 z-40 inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-gold-medium/30 bg-white/20 hover:bg-luxury-dark text-luxury-dark hover:text-gold-light font-sansflex text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-pointer"
          >
            Log In
          </button>
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
                    { name: 'Contact Us', href: '#contact' },
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
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
