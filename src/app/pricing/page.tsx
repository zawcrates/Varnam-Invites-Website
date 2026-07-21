import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildPageMetadata } from '@/features/seo/metadata';
import { Check, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata = buildPageMetadata({
  title: 'Transparent Pricing Details',
  description: 'Choose a premium template, pay a flat one-time licensing fee, and get one full year of hosting with premium RSVP dashboard features.',
  path: '/pricing',
});

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full text-left">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-sansflex text-luxury-dark tracking-wide font-semibold">
            Simple, Transparent Pricing
          </h1>
          <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4 mb-6" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Card 1: Vintage Scroll */}
          <div className="bg-white border border-gold-medium/15 rounded-2xl p-8 flex flex-col justify-between luxury-shadow relative overflow-hidden">
            <div>
              <div className="absolute top-0 right-0 bg-gold-dark text-white text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-bl-xl">
                Vintage
              </div>
              <h3 className="font-sansflex text-xl text-luxury-dark font-bold mb-2">Vintage Parchment Scroll</h3>
              <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
                Classic torn parchment styling, mountain/parallax backgrounds, and traditional script aesthetics.
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-luxury-dark">₹999</span>
                <span className="text-xs text-foreground/45 line-through">₹1,999</span>
                <span className="text-xs text-emerald-600 font-semibold">(50% Off)</span>
              </div>
              <ul className="space-y-3.5 text-xs text-foreground/75 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Real-time Parallax Scrolling</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> One-click WhatsApp RSVP</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Immersive Audio Support (MP3)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Google Maps Integration</li>
              </ul>
            </div>
            <Link href="/templates" className="w-full inline-flex justify-center text-xs uppercase tracking-widest font-bold bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white py-3.5 rounded-full transition-all text-center">
              Choose Template
            </Link>
          </div>

          {/* Card 2: Royal Heritage */}
          <div className="bg-white border border-gold-medium/15 rounded-2xl p-8 flex flex-col justify-between luxury-shadow relative overflow-hidden">
            <div>
              <div className="absolute top-0 right-0 bg-luxury-dark text-white text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-bl-xl">
                Heritage
              </div>
              <h3 className="font-sansflex text-xl text-luxury-dark font-bold mb-2">Royal Heritage</h3>
              <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
                Majestic palace illustration, golden flourishes, and deep royal theme colors.
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-luxury-dark">₹1,299</span>
                <span className="text-xs text-foreground/45 line-through">₹2,499</span>
                <span className="text-xs text-emerald-600 font-semibold">(48% Off)</span>
              </div>
              <ul className="space-y-3.5 text-xs text-foreground/75 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Elegant Gold Leaf Accents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Responsive Mobile Layouts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Custom Event Timeline Planner</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dark shrink-0" /> Full Year Hosting Included</li>
              </ul>
            </div>
            <Link href="/templates" className="w-full inline-flex justify-center text-xs uppercase tracking-widest font-bold bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white py-3.5 rounded-full transition-all text-center">
              Choose Template
            </Link>
          </div>
        </div>

        {/* Info box */}
        <div className="max-w-3xl mx-auto mt-12 bg-gold-light/20 border border-gold-medium/10 rounded-2xl p-5 flex gap-3.5 items-start">
          <Info className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70 leading-relaxed">
            All plans include hosting for 1 year from publication date. No hidden fees or recurring subscriptions. If you need details changed after checkout, our support team can assist with manual updates.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
