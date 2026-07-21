import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildPageMetadata } from '@/features/seo/metadata';
import { Sparkles, Heart, ShieldCheck } from 'lucide-react';

export const metadata = buildPageMetadata({
  title: 'Our Story & Philosophy',
  description: 'Learn about Varnam Invites, our luxury design philosophy, and how we transform traditional wedding invitations into exquisite digital realities.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full text-left">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            About Varnam
          </span>
          <h1 className="text-4xl md:text-5xl font-sansflex text-luxury-dark tracking-wide font-semibold">
            Crafting Digital Elegance
          </h1>
          <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4 mb-6" />
        </div>

        {/* Story details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="font-sansflex text-2xl text-luxury-dark font-semibold">The Varnam Vision</h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              We believe a wedding invitation is not just a card, but the first chapter of your special story. Varnam Invites bridges centuries-old design traditions with modern web animations.
            </p>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Every curve, scroll, and melody is hand-tailored to provide guests with an unforgettable announcement that matches the grandeur of your wedding day.
            </p>
          </div>
          <div className="bg-gold-light/20 border border-gold-medium/10 rounded-2xl p-8 space-y-6">
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-gold-dark shrink-0" />
              <div>
                <h4 className="font-sansflex text-sm font-bold text-luxury-dark mb-1">Premium Animation</h4>
                <p className="text-xs text-foreground/60 leading-normal">Smooth scroll parallax, typography fades, and immersive background music.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-gold-dark shrink-0" />
              <div>
                <h4 className="font-sansflex text-sm font-bold text-luxury-dark mb-1">Personal Touch</h4>
                <p className="text-xs text-foreground/60 leading-normal">Fully customizable text layouts, audio files, mapping, and instant RSVP channels.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <ShieldCheck className="w-6 h-6 text-gold-dark shrink-0" />
              <div>
                <h4 className="font-sansflex text-sm font-bold text-luxury-dark mb-1">Guaranteed Uptime</h4>
                <p className="text-xs text-foreground/60 leading-normal">Hosted on premium servers so your guests can access details 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
