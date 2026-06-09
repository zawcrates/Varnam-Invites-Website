"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import { TEMPLATES } from '@/data/templates';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'Vintage', 'Traditional', 'Modern', 'Floral'];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the customization work?",
      a: "Once you select a template, you can fill in your names, date, venue details, RSVP contact, and load background music. Changes are instantly visible on a live preview screen. After payment, you receive a unique live link."
    },
    {
      q: "Can I edit details after purchasing?",
      a: "Yes! While Phase 1 keeps customization live before checking out, our support can help with minor corrections. Future versions will include full dashboards to edit invitations dynamically."
    },
    {
      q: "Is there background music in the template?",
      a: "Yes! Our templates include background music which can be toggled on or off by your guests. You can upload or link your preferred romantic MP3 track."
    },
    {
      q: "Will the digital invitation work on mobile phones?",
      a: "Absolutely! All templates are responsive and built mobile-first, ensuring an exquisite and polished experience on smartphones, tablets, and desktops alike."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:h-[832px] flex items-center justify-center pt-32 pb-20 px-6 md:px-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-light via-white to-white overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,168,128,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(197,168,128,0.03)_1px,_transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,_white,_transparent)]" />
        <div className="relative w-full max-w-[1280px] h-full mx-auto z-10 flex flex-col items-center justify-center lg:block">
          {/* Blurred Glow Circle behind Carousel */}
          <div 
            className="absolute rounded-full bg-[radial-gradient(circle,_rgba(61,26,4,0.35)_0%,_rgba(61,26,4,0)_70%)] pointer-events-none z-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] left-1/2 lg:left-auto right-auto lg:right-[-100px] top-[150px] lg:top-[50px] -translate-x-1/2 lg:translate-x-0"
            style={{ filter: 'blur(80px)' }}
          />

          {/* Tagline above CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:absolute lg:left-[100px] lg:top-[100px] text-left max-w-md pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left mb-6 lg:mb-0 pt-12 lg:pt-0"
          >
            
            <h1 className="text-3xl sm:text-5xl font-sansflex text-luxury-dark tracking-tighter font-bold leading-[1.1]">
              Beautiful Wedding Invitations
            </h1>
            <p className="text-xs sm:text-sm text-foreground/70 mt-3 max-w-sm leading-relaxed font-sansflex">
              Choose a premium template, personalize every detail with live preview, and share your special day with elegance.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:absolute lg:left-[100px] lg:top-[330px] lg:translate-x-0 lg:bottom-auto mt-8 lg:mt-0"
          >
            <Link 
              href="/templates"
              className="inline-flex items-center justify-center bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-xs sm:text-sm uppercase tracking-widest font-bold w-[259px] h-[52px] rounded-[153px] transition-all duration-300 hover:scale-105 shadow-xl shadow-luxury-dark/15 border border-gold-medium/20"
            >
              <span>Browse Templates</span>
            </Link>
          </motion.div>

          {/* Carousel — after tagline+CTA in DOM so it renders below on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full lg:absolute lg:right-0 lg:left-auto lg:translate-x-0 lg:top-[80px] lg:w-[600px] mt-10 lg:mt-0"
          >
            <HeroCarousel />
          </motion.div>
        </div>

      </section>

      {/* Featured Templates Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            Exclusive Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-sansflex text-luxury-dark tracking-wide font-semibold">
            Our Featured Templates
          </h2>
          <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4" />

          {/* Categories Filter */}
          <div className="flex justify-center mt-8">
            <div className="flex bg-gold-light/30 border border-gold-medium/15 p-1 rounded-full overflow-hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-luxury-dark text-gold-light'
                      : 'text-foreground/60 hover:text-gold-dark'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {TEMPLATES.filter(
            (t) => selectedCategory === 'all' || t.category === selectedCategory
          ).slice(0, 6).map((template) => (
            <motion.div
              key={template.id}
              layout
              whileHover={{ y: -6 }}
              className="bg-gold-light/40 rounded-2xl border border-gold-medium/10 overflow-hidden luxury-shadow hover:shadow-2xl hover:shadow-gold-medium/15 transition-all duration-300 flex flex-col h-full group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-luxury-cream border-b border-gold-medium/10">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-luxury-dark/80 text-gold-medium text-[10px] font-sans uppercase tracking-widest font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-gold-medium/20">
                  {template.category}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col flex-grow text-left">
                <h3 className="font-sansflex text-xl text-luxury-dark mb-2 tracking-wide font-semibold">
                  {template.name}
                </h3>
                <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed font-sansflex mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex justify-between items-center border-t border-gold-medium/10 pt-4 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground/40 font-sansflex uppercase tracking-wider">price</span>
                    <div className="flex items-center gap-2">
                      <span className="font-sansflex font-bold text-lg text-luxury-dark">₹{template.price}</span>
                      <span className="font-sansflex text-xs text-foreground/40 line-through">₹{template.originalPrice}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/templates/${template.slug}`}
                      className="text-xs uppercase tracking-wider font-semibold bg-luxury-dark hover:bg-gold-dark text-white px-4 py-2.5 rounded-full transition-colors font-sansflex border border-gold-medium/20"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/templates"
            className="inline-flex items-center justify-center bg-luxury-dark hover:bg-gold-dark text-white hover:text-gold-light font-sansflex text-xs uppercase tracking-widest font-bold w-[200px] h-[48px] rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-luxury-dark/10 border border-gold-medium/20"
          >
            Load More
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 md:px-12 bg-luxury-dark border-y border-gold-medium/20">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-gold-medium text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            Seamless Process
          </span>
          <h2 className="text-3xl md:text-4xl font-sansflex text-white tracking-wide font-semibold">
            How It Works
          </h2>
          <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Select Template", desc: "Browse our handpicked templates and choose the style that resonates with your wedding aesthetic." },
            { step: "02", title: "Personalize Details", desc: "Input names, timelines, map coordinates, and select romantic background scores with real-time live preview." },
            { step: "03", title: "Secure Checkout", desc: "Review your invitation, pay securely via Razorpay, and complete the order inside minutes." },
            { step: "04", title: "Share Instantly", desc: "Get your personalized web invitation link and share it directly with family and friends on WhatsApp or socials." }
          ].map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-gold-medium/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-gold-medium/30 transition-all duration-300">
              <span className="font-sansflex text-4xl font-bold text-gold-medium/45 mb-4 block">
                {item.step}
              </span>
              <h3 className="font-sansflex text-lg text-white font-semibold tracking-wide mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-gold-light/65 leading-relaxed font-sansflex">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
            Love Stories
          </span>
          <h2 className="text-3xl font-sansflex text-luxury-dark tracking-wide font-semibold mb-12">
            What Couples Say
          </h2>
          <div className="relative p-10 bg-gold-light/40 rounded-2xl border border-gold-medium/10 luxury-shadow max-w-2xl mx-auto">
            <span className="absolute top-2 left-6 text-7xl font-sansflex text-gold-medium/10 select-none">“</span>
            <p className="text-sm italic leading-relaxed text-foreground/80 font-sansflex mb-6 relative z-10">
              &ldquo;We chose the Vintage Parchment scroll for our wedding. Our friends and family were absolutely amazed by the music and the parallax effect. Customizing it took under 5 minutes, and we got our link instantly after pay. Highly recommend Varnam Invites!&rdquo;
            </p>
            <div>
              <h4 className="font-sansflex font-bold text-xs uppercase tracking-wider text-luxury-dark">Aarav & Riya</h4>
              <p className="text-[10px] text-foreground/40 font-sansflex uppercase tracking-widest mt-0.5">Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 md:px-12 bg-luxury-dark border-t border-gold-medium/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-medium text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
              Clarifications
            </span>
            <h2 className="text-3xl font-sansflex text-white tracking-wide font-semibold">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-[2px] bg-gold-medium mx-auto mt-4" />
          </div>

          <div className="flex flex-col">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="border-b border-gold-medium/15 last:border-b-0 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4.5 px-1 flex justify-between items-center text-left transition-colors cursor-pointer group"
                  >
                    <span className="font-sansflex font-semibold text-xs sm:text-sm text-white group-hover:text-gold-medium transition-colors pr-4">
                      {faq.q}
                    </span>
                    <Plus className={`w-4 h-4 text-gold-medium shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-45 text-white' : 'group-hover:text-white'}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-1 pb-4.5 pt-1 text-xs sm:text-sm text-gold-light/70 leading-relaxed font-sansflex">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="mailto:support@varnaminvites.com?subject=Enquiry%20regarding%20Wedding%20Invitation%20Templates"
              className="inline-flex items-center justify-center bg-gold-medium hover:bg-gold-dark text-luxury-dark hover:text-white font-sansflex text-xs uppercase tracking-widest font-bold w-[200px] h-[48px] rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-gold-medium/15 border border-gold-medium/20"
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
