import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildPageMetadata } from '@/features/seo/metadata';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = buildPageMetadata({
  title: 'Contact Support & Sales',
  description: 'Have a question about template personalization, custom audio additions, or transaction processing? Get in touch with our wedding specialists.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-left">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-sansflex text-luxury-dark tracking-wide font-semibold">
            Contact Our Specialists
          </h1>
          <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4 mb-6" />
        </div>

        {/* Contact details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-3xl mx-auto mb-16">
          <div className="bg-white border border-gold-medium/10 rounded-2xl p-6 flex flex-col items-center justify-center luxury-shadow">
            <Mail className="w-8 h-8 text-gold-dark mb-4" />
            <h4 className="font-sansflex font-bold text-luxury-dark mb-1">Email Us</h4>
            <p className="text-xs text-foreground/60">support@varnaminvites.com</p>
          </div>

          <div className="bg-white border border-gold-medium/10 rounded-2xl p-6 flex flex-col items-center justify-center luxury-shadow">
            <Phone className="w-8 h-8 text-gold-dark mb-4" />
            <h4 className="font-sansflex font-bold text-luxury-dark mb-1">Call Us</h4>
            <p className="text-xs text-foreground/60">+91 98765 43210</p>
          </div>

          <div className="bg-white border border-gold-medium/10 rounded-2xl p-6 flex flex-col items-center justify-center luxury-shadow">
            <MapPin className="w-8 h-8 text-gold-dark mb-4" />
            <h4 className="font-sansflex font-bold text-luxury-dark mb-1">Headquarters</h4>
            <p className="text-xs text-foreground/60">Bangalore, Karnataka, India</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
