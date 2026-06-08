"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Check, Clipboard, ExternalLink, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get('id') || '';

  const [copied, setCopied] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  interface OrderDetails {
    id: string;
    templateSlug: string;
    billingDetails: {
      name: string;
      email: string;
      phone: string;
    };
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Determine site host on client mount
    if (typeof window !== 'undefined') {
      const link = `${window.location.origin}/invitation/${invitationId}`;
      setInvitationLink(link);

      // Load published info from localStorage
      const published = JSON.parse(localStorage.getItem('varnam_published_invitations') || '{}');
      if (published[invitationId]) {
        setOrderDetails(published[invitationId]);
      }
    }

    // Fire confetti burst!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#c5a880', '#834701', '#ebdcb9']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#c5a880', '#834701', '#ebdcb9']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, [invitationId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 text-left">
      <div className="bg-white border border-gold-medium/10 rounded-2xl p-8 md:p-12 luxury-shadow text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#1b7937]/15 rounded-full flex items-center justify-center mx-auto text-[#1b7937] mb-8 ring-8 ring-[#1b7937]/5">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>

        <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-3 block">
          Congratulations
        </span>
        <h1 className="font-sansflex text-3xl sm:text-4xl text-luxury-dark tracking-wide font-semibold mb-4">
          Order Confirmed!
        </h1>
        <p className="text-sm text-foreground/75 leading-relaxed max-w-md mx-auto mb-10 font-sansflex">
          Your payment was successful and your premium digital wedding invitation is now live. Share the link below with your family and guests.
        </p>

        {/* Invitation Live Link Box */}
        <div className="bg-gold-light/25 border border-gold-medium/15 p-6 rounded-2xl max-w-lg mx-auto mb-10 text-left">
          <h4 className="font-sansflex text-xs uppercase tracking-widest text-gold-dark font-bold mb-3">
            Your Digital Invitation Link
          </h4>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              readOnly
              value={invitationLink}
              className="flex-grow bg-white border border-gold-medium/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-luxury-dark outline-none select-all"
            />
            
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="flex-grow sm:flex-grow-0 inline-flex items-center justify-center gap-1.5 bg-white border border-gold-medium/20 hover:border-gold-medium/50 text-luxury-dark text-xs uppercase tracking-wider font-semibold px-4.5 py-3 rounded-xl transition-all"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              
              <a
                href={invitationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-wider font-semibold px-4.5 py-3 rounded-xl transition-all"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Order Details Accordion recap */}
        {orderDetails && (
          <div className="border-t border-gold-medium/10 pt-8 mt-8 text-left max-w-lg mx-auto">
            <h4 className="font-sansflex text-sm font-bold text-luxury-dark mb-4">
              Order Details
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-sansflex">
              <span className="text-foreground/45">Invitation ID:</span>
              <span className="font-mono text-right font-medium text-luxury-dark">{orderDetails.id}</span>

              <span className="text-foreground/45">Billed To:</span>
              <span className="text-right font-medium text-luxury-dark">{orderDetails.billingDetails.name}</span>

              <span className="text-foreground/45">Selected Template:</span>
              <span className="text-right font-medium text-luxury-dark capitalize">{orderDetails.templateSlug.replace('-', ' ')}</span>

              <span className="text-foreground/45">Amount Paid:</span>
              <span className="text-right font-bold text-gold-dark">₹{orderDetails.templateSlug === 'vintage-parchment' ? '999' : '1299'}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 border-t border-gold-medium/10 pt-8 mt-10 max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold border border-gold-medium/20 hover:border-gold-medium/55 hover:bg-gold-light text-luxury-dark px-6 py-3.5 rounded-full transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f0]">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center min-h-[50vh] text-[#834701] font-sansflex text-lg tracking-widest">
              Loading Order Confirmation...
            </div>
          }
        >
          <SuccessPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
