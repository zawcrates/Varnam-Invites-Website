"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, CheckCircle2, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      // 1. Post inquiry to server route (dispatches directly to varnaminvites@gmail.com)
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      // 2. Trigger direct mailto client fallback for instant email app dispatch
      const mailtoUrl = `mailto:varnaminvites@gmail.com?subject=${encodeURIComponent(`Inquiry from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.open(mailtoUrl, "_blank");
    } catch (err) {
      console.error("Failed to process contact submission:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full text-left">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-gold-dark text-xs uppercase tracking-widest font-semibold block">
            Get In Touch
          </span>
          <h1 className="font-sansflex text-3xl md:text-5xl text-luxury-dark font-bold tracking-tight">
            We&rsquo;re here to help.
          </h1>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed font-sans">
            Have a question about your invitation, order, or customization? Send us a message and we&rsquo;ll get back to you as soon as we can.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Minimalist Contact Form matching design */}
          <div className="lg:col-span-7 bg-white border border-gold-medium/15 rounded-3xl p-8 sm:p-12 luxury-shadow">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h3 className="font-sansflex text-2xl font-bold text-luxury-dark">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-foreground/70 max-w-md mx-auto">
                  Thank you for contacting Varnam Invites. Our support team will review your inquiry and get back to your email within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-block mt-4 text-xs uppercase tracking-widest font-semibold text-gold-dark hover:underline"
                >
                  Send another message &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-semibold text-foreground/60">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-luxury-dark py-2.5 text-sm text-luxury-dark outline-none transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-semibold text-foreground/60">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-luxury-dark py-2.5 text-sm text-luxury-dark outline-none transition-colors"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-semibold text-foreground/60">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help with your invitation?"
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-luxury-dark py-2.5 text-sm text-luxury-dark outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button (Pill shaped black button) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-sansflex text-sm uppercase tracking-wider font-semibold py-4 rounded-full transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gold-medium/15 rounded-3xl p-8 luxury-shadow space-y-6">
              <h3 className="font-sansflex text-lg font-bold text-luxury-dark pb-3 border-b border-gold-medium/10">
                Direct Channels
              </h3>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gold-light/40 border border-gold-medium/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-dark">Email Us</h4>
                    <a href="mailto:varnaminvites@gmail.com" className="text-foreground/70 hover:text-gold-dark transition-colors">
                      varnaminvites@gmail.com
                    </a>
                    <p className="text-[11px] text-foreground/45 mt-0.5">We respond within 24 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gold-light/40 border border-gold-medium/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-dark">Call or WhatsApp</h4>
                    <a href="tel:+916379237294" className="text-foreground/70 hover:text-gold-dark transition-colors">
                      +91 63792 37294
                    </a>
                    <p className="text-[11px] text-foreground/45 mt-0.5">Mon &ndash; Sat, 10 AM &ndash; 7 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gold-light/40 border border-gold-medium/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-dark">Location</h4>
                    <p className="text-foreground/70">Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Assistance Note */}
            <div className="bg-gold-light/30 border border-gold-medium/20 rounded-2xl p-6 text-xs text-foreground/75 leading-relaxed">
              <span className="font-bold text-luxury-dark block mb-1">Need Urgent Order Help?</span>
              If you have already placed an order, please include your <strong>Order ID</strong> in your message for faster resolution.
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
