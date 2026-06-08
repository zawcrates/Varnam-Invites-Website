"use client";

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, ShieldCheck, CheckCircle, CreditCard, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TEMPLATES, InviteData } from '@/data/templates';

export default function CheckoutPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const [customData, setCustomData] = useState<InviteData | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'simulating' | 'success'>('idle');
  const [simStatus, setSimStatus] = useState('');

  // Billing Form State
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingName, setBillingName] = useState('');
  const [billingCountryCode, setBillingCountryCode] = useState('+91');

  // Load customized data on mount
  useEffect(() => {
    const slug = localStorage.getItem('varnam_active_slug');
    const dataString = localStorage.getItem('varnam_active_custom_data');
    
    if (slug && dataString) {
      setTemplateSlug(slug);
      try {
        setCustomData(JSON.parse(dataString));
      } catch (e) {
        console.error("Error loading customized data", e);
      }
    }
  }, []);

  // Find template metadata
  const template = TEMPLATES.find(t => t.slug === templateSlug) || TEMPLATES[0];

  if (!templateSlug || !customData) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6 pt-32">
          <div className="text-center bg-white border border-gold-medium/15 p-8 rounded-2xl max-w-md w-full luxury-shadow">
            <ShoppingBag className="w-12 h-12 text-gold-medium/40 mx-auto mb-4" />
            <h3 className="font-sansflex text-lg font-semibold text-luxury-dark mb-2">No Active Customization</h3>
            <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
              It looks like you haven&apos;t customized any wedding cards yet. Browse our templates to get started!
            </p>
            <Link
              href="/templates"
              className="inline-flex justify-center text-xs uppercase tracking-widest font-semibold bg-luxury-dark hover:bg-gold-dark text-white px-6 py-3.5 rounded-full transition-all"
            >
              Browse Templates
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingEmail || !billingPhone || !billingName) {
      alert("Please fill in your contact details.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(billingEmail.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    const cleanPhone = billingPhone.trim().replace(/\s+/g, '');
    const internationalPhoneRegex = /^\d{7,14}$/;

    const isValidPhone = billingCountryCode === "+91"
      ? phoneRegex.test(cleanPhone)
      : internationalPhoneRegex.test(cleanPhone);

    if (!isValidPhone) {
      alert(billingCountryCode === "+91"
        ? "Please enter a valid 10-digit mobile number."
        : "Please enter a valid phone number (7 to 14 digits).");
      return;
    }

    setPaymentStep('simulating');
    
    // Step-by-step checkout overlay simulation
    const statuses = [
      "Connecting to Razorpay secure servers...",
      "Validating credit card credentials...",
      "Authorizing payment with bank gateway...",
      "Verifying secure transaction signatures...",
      "Payment authorized successfully! Finalizing order..."
    ];

    let currentStatusIdx = 0;
    setSimStatus(statuses[0]);

    const interval = setInterval(() => {
      currentStatusIdx++;
      if (currentStatusIdx < statuses.length) {
        setSimStatus(statuses[currentStatusIdx]);
      } else {
        clearInterval(interval);
        
        // Save to final database (localStorage simulation)
        const invitationId = `invite_${Math.random().toString(36).substr(2, 9)}`;
        const finalInviteRecord = {
          id: invitationId,
          templateSlug: templateSlug,
          inviteData: customData,
          billingDetails: {
            name: billingName,
            email: billingEmail,
            phone: `${billingCountryCode}${cleanPhone}`
          },
          purchaseDate: new Date().toISOString(),
          isPaid: true
        };

        // Write to invitations registry
        const currentInvites = JSON.parse(localStorage.getItem('varnam_published_invitations') || '{}');
        currentInvites[invitationId] = finalInviteRecord;
        localStorage.setItem('varnam_published_invitations', JSON.stringify(currentInvites));

        // Move to success
        setPaymentStep('success');
        setTimeout(() => {
          startTransition(() => {
            router.push(`/success?id=${invitationId}`);
          });
        }, 1500);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full text-left">
        {/* Back Link */}
        <Link 
          href={`/customize/${templateSlug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-foreground/50 hover:text-gold-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to customize</span>
        </Link>

        <h1 className="font-sansflex text-3xl sm:text-4xl text-luxury-dark tracking-wide font-semibold mb-12">
          Review & Complete Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Order summary details & billing inputs */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Preview Details Recap */}
            <div className="bg-white border border-gold-medium/10 rounded-2xl p-6 md:p-8 luxury-shadow text-left">
              <h3 className="font-sansflex text-lg font-bold text-luxury-dark pb-3 border-b border-gold-medium/5 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-dark" />
                <span>Customized Invitation Recap</span>
              </h3>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider font-semibold text-foreground/45 mb-0.5">Groom & Bride</dt>
                  <dd className="font-sansflex text-base text-luxury-dark">{customData.groomName} {customData.connector} {customData.brideName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider font-semibold text-foreground/45 mb-0.5">Wedding Month</dt>
                  <dd className="font-sansflex font-medium text-luxury-dark">{customData.month}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider font-semibold text-foreground/45 mb-0.5">Ceremony Date Details</dt>
                  <dd className="font-sansflex font-medium text-luxury-dark">{customData.dateDetails}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider font-semibold text-foreground/45 mb-0.5">Wedding Time</dt>
                  <dd className="font-sansflex text-luxury-dark">{customData.time}</dd>
                </div>
                <div className="sm:col-span-2 border-t border-gold-medium/5 pt-4">
                  <dt className="text-xs uppercase tracking-wider font-semibold text-foreground/45 mb-0.5">Venue Location</dt>
                  <dd className="font-sansflex font-medium text-luxury-dark">
                    <span className="block font-bold mb-0.5">{customData.locationLine1}</span>
                    <span className="text-foreground/75 leading-relaxed text-xs">{customData.locationLine2}</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Step 2: Contact Form */}
            <form onSubmit={handleSimulatePayment} className="bg-white border border-gold-medium/10 rounded-2xl p-6 md:p-8 luxury-shadow space-y-6 text-left">
              <h3 className="font-sansflex text-lg font-bold text-luxury-dark pb-3 border-b border-gold-medium/5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-dark" />
                <span>Contact & Billing Details</span>
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  placeholder="e.g. Virat Kohli"
                  className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3.5 text-sm outline-none text-luxury-dark transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Email Address</label>
                  <input
                    type="email"
                    required
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="e.g. info@virat.com"
                    className="w-full bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3.5 text-sm outline-none text-luxury-dark transition-all font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={billingCountryCode}
                      onChange={(e) => setBillingCountryCode(e.target.value)}
                      className="bg-gold-light/20 border border-gold-medium/20 rounded-xl px-3 py-3 text-sm outline-none text-luxury-dark font-mono font-medium cursor-pointer focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                      <option value="+65">+65</option>
                      <option value="+61">+61</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={billingPhone}
                      onChange={(e) => setBillingPhone(e.target.value)}
                      placeholder="9876543210"
                      className="flex-grow bg-gold-light/20 border border-gold-medium/20 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3.5 text-sm outline-none text-luxury-dark transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-medium/5">
                <p className="text-[10px] text-foreground/45 leading-normal">
                  By completing the checkout, you authorize publishing this digital invitation on Varnam Invites servers. The link will remain active for one full year.
                </p>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isPending || paymentStep !== 'idle'}
                className="w-full inline-flex items-center justify-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-sm uppercase tracking-widest font-semibold py-4.5 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxury-dark/10 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{template.price} & Live Publish</span>
              </button>
            </form>

          </div>

          {/* Right Side: Order summary receipt card */}
          <aside className="lg:col-span-5 bg-white border border-gold-medium/10 rounded-2xl overflow-hidden luxury-shadow">
            
            {/* Header image */}
            <div className="h-44 overflow-hidden relative border-b border-gold-medium/10">
              <img 
                src={template.thumbnail} 
                alt={template.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <span className="text-gold-medium text-[10px] font-semibold uppercase tracking-widest mb-0.5">Selected Style</span>
                <h3 className="text-white text-base font-sansflex font-bold tracking-wide">{template.name}</h3>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="p-6 md:p-8 space-y-6 text-left">
              <h4 className="font-sansflex text-sm uppercase tracking-widest text-luxury-dark font-bold pb-2 border-b border-gold-medium/5">
                Receipt Summary
              </h4>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-foreground/75">
                  <span>Template Access License</span>
                  <span className="font-semibold text-luxury-dark">₹{template.originalPrice}</span>
                </div>
                <div className="flex justify-between text-[#1b7937] font-sansflex font-medium">
                  <span>Seasonal Launch Discount</span>
                  <span>-₹{template.originalPrice - template.price}</span>
                </div>
                <div className="flex justify-between text-foreground/75">
                  <span>Server Hosting (1 Year)</span>
                  <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">Free</span>
                </div>
                
                <div className="border-t border-gold-medium/10 pt-4 flex justify-between items-baseline">
                  <span className="font-sansflex font-bold text-luxury-dark">Total Amount Due</span>
                  <span className="font-sansflex font-bold text-2xl text-gold-dark">₹{template.price}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-gold-light/20 border border-gold-medium/10 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-foreground/80 leading-normal">
                  <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <span>Interactive template preview live instantly.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground/80 leading-normal">
                  <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <span>RSVP dashboard link delivered to email.</span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      {/* Razorpay Simulation Modal Overlay */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white border border-gold-medium/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
            
            {/* Gold details line top */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark" />

            {paymentStep === 'simulating' ? (
              <div className="space-y-6 py-6">
                <div className="w-16 h-16 border-4 border-gold-medium/20 border-t-gold-dark rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="font-sansflex font-bold text-lg text-luxury-dark mb-1">Razorpay Secure Checkout</h4>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-semibold font-mono">Test Sandbox Mode</p>
                </div>
                <div className="bg-gold-light/35 border border-gold-medium/10 p-4 rounded-xl">
                  <p className="text-xs text-gold-dark font-sansflex leading-relaxed min-h-[40px] flex items-center justify-center font-medium">
                    {simStatus}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-6 animate-fade-in">
                <div className="w-16 h-16 bg-[#1b7937]/15 rounded-full flex items-center justify-center mx-auto text-[#1b7937]">
                  <CheckCircle className="w-8 h-8 stroke-2" />
                </div>
                <div>
                  <h4 className="font-sansflex font-bold text-lg text-luxury-dark mb-1">Payment Successful!</h4>
                  <p className="text-xs text-[#1b7937] font-semibold tracking-wider uppercase font-sansflex">Redirecting to confirmation...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
