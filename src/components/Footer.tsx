import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-luxury-dark text-gold-light/80 border-t border-gold-medium/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-2 self-center flex flex-col items-start gap-1">
          <Link href="/" className="relative block h-30 w-100 overflow-hidden group">
            <img 
              src="/Varnam_svg1.png" 
              alt="Varnam Invites Logo" 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-44 w-auto object-contain max-w-none transition-opacity group-hover:opacity-85" 
            />
          </Link>
          <p className="font-sansflex text-xs text-gold-light/50 tracking-wide pl-4 max-w-xs leading-relaxed">
            Crafting elegant digital invitations for your special celebrations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sansflex text-sm uppercase tracking-widest text-white mb-6">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-gold-light/60">
            <li>
              <Link href="/" className="hover:text-gold-medium transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-gold-medium transition-colors">
                Browse Templates
              </Link>
            </li>
            <li>
              <Link href="/my-invites" className="hover:text-gold-medium transition-colors">
                My Invites
              </Link>
            </li>
            <li>
              <a href="#contact" className="hover:text-gold-medium transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-sansflex text-sm uppercase tracking-widest text-white mb-6">
            Contact
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-gold-light/60">
            <li>
              <span>Email: support@varnaminvites.com</span>
            </li>
            <li>
              <span>Phone: +91 98765 43210</span>
            </li>
            <li>
              <span>Bangalore, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-gold-medium/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gold-light/40">
          &copy; {currentYear} Varnam Invites. All rights reserved. Built with love for your special day.
        </p>
        <div className="flex gap-6 text-xs text-gold-light/40">
          <a href="#" className="hover:text-gold-medium transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold-medium transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
