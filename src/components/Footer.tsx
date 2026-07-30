import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-luxury-dark text-gold-light/80 border-t border-gold-medium/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <Link href="/" className="inline-block relative h-16 sm:h-20 w-56 sm:w-72 group">
            <Image 
              src="/Varnam_svg1.png" 
              alt="Varnam Invites Logo - Premium Digital Wedding Invitations" 
              width={320}
              height={135}
              className="w-auto h-full object-contain object-left transition-opacity group-hover:opacity-85" 
            />
          </Link>
          <p className="font-sansflex text-xs text-gold-light/50 tracking-wide max-w-sm leading-relaxed">
            Varnam Invites is India&apos;s premier digital wedding invitation &amp; wedding website maker. Personalize invitations with music, Google Maps venue location, RSVP tracking, and instant mobile sharing.
          </p>
        </div>

        {/* Popular Categories */}
        <div>
          <h4 className="font-sansflex text-xs uppercase tracking-widest text-white font-bold mb-6">
            Invitation Styles
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-gold-light/60">
            <li>
              <Link href="/invitations/digital-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Digital Wedding Invitations
              </Link>
            </li>
            <li>
              <Link href="/invitations/wedding-invitation-maker" className="hover:text-gold-medium transition-colors">
                Wedding Invitation Maker
              </Link>
            </li>
            <li>
              <Link href="/invitations/hindu-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Hindu Wedding Cards
              </Link>
            </li>
            <li>
              <Link href="/invitations/tamil-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Tamil Wedding Invites
              </Link>
            </li>
            <li>
              <Link href="/invitations/telugu-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Telugu Wedding Invites
              </Link>
            </li>
            <li>
              <Link href="/invitations/muslim-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Muslim Nikah Invitations
              </Link>
            </li>
            <li>
              <Link href="/invitations/christian-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Christian Wedding Cards
              </Link>
            </li>
            <li>
              <Link href="/invitations/luxury-wedding-invitations" className="hover:text-gold-medium transition-colors">
                Luxury Wedding Websites
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sansflex text-xs uppercase tracking-widest text-white font-bold mb-6">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-gold-light/60">
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
              <Link href="/pricing" className="hover:text-gold-medium transition-colors">
                Pricing &amp; License
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-medium transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gold-medium transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-medium transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/my-invites" className="hover:text-gold-medium transition-colors">
                My Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-sansflex text-xs uppercase tracking-widest text-white font-bold mb-6">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-3 text-xs text-gold-light/60">
            <li>
              <span>Email: varnaminvites@gmail.com</span>
            </li>
            <li>
              <span>Phone: +91 63792 37294</span>
            </li>
            <li>
              <span>Chennai, Tamil Nadu, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-gold-medium/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gold-light/40">
          &copy; {currentYear} Varnam Invites. All rights reserved. Crafted with elegance for your special day.
        </p>
        <div className="flex gap-6 text-xs text-gold-light/40">
          <Link href="/terms" className="hover:text-gold-medium transition-colors">Terms of Service</Link>
          <Link href="/privacy-policy" className="hover:text-gold-medium transition-colors">Privacy Policy</Link>
          <Link href="/refund-policy" className="hover:text-gold-medium transition-colors">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
