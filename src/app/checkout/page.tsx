"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ShieldCheck, CheckCircle, CreditCard, Sparkles, AlertCircle, RefreshCw, Loader2, Eye, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/hooks/useAuth';
import { useCheckout } from '@/hooks/useCheckout';
import { TEMPLATES, InviteData } from '@/data/templates';
import { generateWhatsAppMessage } from '@/components/WhatsAppOrderModal';

export default function CheckoutPage() {
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const [customData, setCustomData] = useState<InviteData | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const isLaunchMode = process.env.NEXT_PUBLIC_LAUNCH_MODE?.toLowerCase() === "true";

  // Billing Form State
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingName, setBillingName] = useState('');
  const [billingCountryCode, setBillingCountryCode] = useState('+91');

  // Authentication & Inline Checkout resume flow
  const { user, profile } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Load customized data and project reference on mount
  useEffect(() => {
    const slug = localStorage.getItem('varnam_active_slug');
    const dataString = localStorage.getItem('varnam_active_custom_data');
    const pid = localStorage.getItem('varnam_active_project_id');

    if (slug && dataString) {
      setTemplateSlug(slug);
      try {
        setCustomData(JSON.parse(dataString));
      } catch (e) {
        console.error("Error loading customized data", e);
      }
    }

    if (pid) {
      setProjectId(pid);
    }
  }, []);

  // Auto-populate contact fields once user is logged in
  useEffect(() => {
    if (user) {
      if (user.name && !billingName) setBillingName(user.name);
      if (user.email && !billingEmail) setBillingEmail(user.email);
      if (profile?.phone && !billingPhone) {
        const phoneVal = profile.phone;
        if (phoneVal.startsWith('+')) {
          const codes = ['+91', '+971', '+61', '+65', '+44', '+1'];
          const matchedCode = codes.find(c => phoneVal.startsWith(c));
          if (matchedCode) {
            setBillingCountryCode(matchedCode);
            setBillingPhone(phoneVal.slice(matchedCode.length));
          } else {
            setBillingPhone(phoneVal);
          }
        } else {
          setBillingPhone(phoneVal);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  // Resume generic pending action after successful authentication
  useEffect(() => {
    if (user && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  // Find template metadata
  const template = TEMPLATES.find(t => t.slug === templateSlug) || TEMPLATES[0];

  // Razorpay checkout hook — drives payment state machine when launch mode is false
  const { checkoutState, startPayment, retryPayment } = useCheckout(projectId);

  const isProcessing = checkoutState.step !== 'idle' && checkoutState.step !== 'failed' && checkoutState.step !== 'error';

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const action = () => {
      startPayment(
        {
          name: billingName,
          email: billingEmail,
          phone: billingPhone,
          countryCode: billingCountryCode,
        },
        billingName
      );
    };

    if (!user) {
      setPendingAction(() => action);
      setShowLogin(true);
      return;
    }

    action();
  };

  const handleRetry = () => {
    retryPayment();
  };

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

  // Pre-formatted WhatsApp Message for Launch Mode
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916379237294";
  const rawWhatsappMsg = generateWhatsAppMessage({
    templateName: template.name,
    groomName: customData.groomName,
    brideName: customData.brideName,
    month: customData.month,
    dateDetails: customData.dateDetails,
    venueLine1: customData.locationLine1,
    venueLine2: customData.locationLine2,
  });
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(rawWhatsappMsg)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full text-left">

        <h1 className="font-sansflex text-3xl sm:text-4xl text-luxury-dark tracking-wide font-semibold mb-2">
          Complete Your Order
        </h1>
        <p className="text-xs sm:text-sm text-foreground/65 mb-12 max-w-2xl leading-relaxed">
          {isLaunchMode
            ? "To ensure every invitation is reviewed and formatted perfectly before delivery, we complete orders personally through WhatsApp."
            : "Review your customized invitation details below and complete your order."}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Order summary details & action */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
            
            {/* Step 1: Preview Details Recap */}
            <div className="bg-white border border-gold-medium/10 rounded-2xl p-6 md:p-8 luxury-shadow text-left">
              <h3 className="font-sansflex text-lg font-bold text-luxury-dark pb-3 border-b border-gold-medium/5 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-dark" />
                <span>Customized Invitation Recap</span>
              </h3>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider font-semibold text-foreground/45 mb-0.5">Groom &amp; Bride</dt>
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

            {/* Launch Mode WhatsApp CTA OR Legacy Razorpay Billing Form */}
            {isLaunchMode ? (
              <div className="bg-white border border-gold-medium/10 rounded-2xl p-6 md:p-8 luxury-shadow space-y-6 text-left">
                <h3 className="font-sansflex text-lg font-bold text-luxury-dark pb-3 border-b border-gold-medium/5 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>Personalized Order Fulfillment</span>
                </h3>

                <p className="text-xs text-foreground/75 leading-relaxed">
                  Clicking the button below will connect you directly with our design team on WhatsApp with your customized invitation details prefilled.
                </p>

                <div className="bg-gold-light/20 border border-gold-medium/15 rounded-xl p-4 space-y-2 text-xs">
                  <p className="font-semibold text-luxury-dark uppercase tracking-wider text-[10px]">What happens next?</p>
                  <ul className="space-y-1.5 text-foreground/80 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                      Our team reviews your invitation details
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                      We confirm custom styling &amp; special requests
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0" />
                      Your live shareable website link is delivered to you
                    </li>
                  </ul>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-sansflex text-sm uppercase tracking-widest font-bold py-4.5 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg text-center cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current stroke-none" />
                  <span>Continue on WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} className="bg-white border border-gold-medium/10 rounded-2xl p-6 md:p-8 luxury-shadow space-y-6 text-left">
                <h3 className="font-sansflex text-lg font-bold text-luxury-dark pb-3 border-b border-gold-medium/5 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gold-dark" />
                  <span>Contact &amp; Billing Details</span>
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/60">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="e.g. Virat Kohli"
                    className={`w-full bg-gold-light/20 border focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3.5 text-sm outline-none text-luxury-dark transition-all ${checkoutState.formErrors.name ? 'border-red-400' : 'border-gold-medium/20 focus:border-gold-dark'}`}
                  />
                  {checkoutState.formErrors.name && (
                    <span className="text-xs text-red-500">{checkoutState.formErrors.name}</span>
                  )}
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
                      className={`w-full bg-gold-light/20 border focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3.5 text-sm outline-none text-luxury-dark transition-all font-mono ${checkoutState.formErrors.email ? 'border-red-400' : 'border-gold-medium/20 focus:border-gold-dark'}`}
                    />
                    {checkoutState.formErrors.email && (
                      <span className="text-xs text-red-500">{checkoutState.formErrors.email}</span>
                    )}
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
                        className={`flex-grow bg-gold-light/20 border focus:ring-1 focus:ring-gold-dark rounded-xl px-4 py-3.5 text-sm outline-none text-luxury-dark transition-all font-mono ${checkoutState.formErrors.phone ? 'border-red-400' : 'border-gold-medium/20 focus:border-gold-dark'}`}
                      />
                    </div>
                    {checkoutState.formErrors.phone && (
                      <span className="text-xs text-red-500">{checkoutState.formErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-medium/5">
                  <p className="text-[10px] text-foreground/45 leading-normal">
                    By completing the checkout, you authorize publishing this digital invitation on Varnam Invites servers. The link will remain active for one full year.
                  </p>
                </div>

                {/* System error message */}
                {(checkoutState.step === 'error' || checkoutState.step === 'failed') && checkoutState.errorMessage && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-grow">
                      <p className="text-xs text-red-600 leading-relaxed">{checkoutState.errorMessage}</p>
                      <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-red-600 hover:text-red-800 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-sm uppercase tracking-widest font-semibold py-4.5 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxury-dark/10 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{template.price} &amp; Continue</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Right Side: Order summary receipt card */}
          <aside className="lg:col-span-5 bg-white border border-gold-medium/10 rounded-2xl overflow-hidden luxury-shadow order-1 lg:order-2">
            
            {/* Header image with Thumbnail & Live Preview Button */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-luxury-cream border-b border-gold-medium/10 group">
              <Image 
                src={template.thumbnail} 
                alt={template.name} 
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-6">
                {/* Top Bar: Preview Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const slug = templateSlug || template.slug;
                      window.open(`/invitation/preview?template=${slug}`, '_blank');
                    }}
                    className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-luxury-dark hover:text-gold-dark text-xs font-semibold px-3.5 py-2 rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-20"
                    title="Preview live interactive invitation"
                  >
                    <Eye className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Bottom: Template Title & Style */}
                <div>
                  <span className="text-gold-medium text-[10px] font-semibold uppercase tracking-widest block mb-0.5">Selected Style</span>
                  <h3 className="text-white text-lg font-sansflex font-bold tracking-wide">{template.name}</h3>
                </div>
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
                  <span>Lifetime Server Hosting</span>
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
                  <span>Shareable website link delivered instantly to email.</span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      {/* Payment Processing Overlay — same visual design as simulation, now driven by real state */}
      {(checkoutState.step === 'creating' || checkoutState.step === 'razorpay' || checkoutState.step === 'verifying' || checkoutState.step === 'success') && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white border border-gold-medium/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
            
            {/* Gold details line top */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark" />

            {checkoutState.step !== 'success' ? (
              <div className="space-y-6 py-6">
                <div className="w-16 h-16 border-4 border-gold-medium/20 border-t-gold-dark rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="font-sansflex font-bold text-lg text-luxury-dark mb-1">Razorpay Secure Checkout</h4>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-semibold font-mono">256-bit SSL Encrypted</p>
                </div>
                <div className="bg-gold-light/35 border border-gold-medium/10 p-4 rounded-xl">
                  <p className="text-xs text-gold-dark font-sansflex leading-relaxed min-h-[40px] flex items-center justify-center font-medium">
                    {checkoutState.statusMessage}
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

      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => {
            setShowLogin(false);
            setPendingAction(null);
          }}
          onLoginSuccess={() => {
            setShowLogin(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
