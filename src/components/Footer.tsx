import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-luxury-dark text-gold-light/80 border-t border-gold-medium/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <span className="font-sansflex text-2xl font-bold tracking-widest text-white group-hover:text-gold-medium transition-colors">
              VARNAM
            </span>
            <span className="font-sansflex text-xs uppercase tracking-[0.25em] text-gold-medium border-l border-gold-medium/40 pl-2 mt-1">
              Invites
            </span>
          </Link>
          <p className="text-sm text-gold-light/60 max-w-sm mb-6 leading-relaxed">
            Create stunning, modern, and interactive digital wedding invitations with a premium look. Personalize every element and share your special day with elegance.
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
