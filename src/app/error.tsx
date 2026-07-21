"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics service or logger
    console.error("[GlobalError] Caught unexpected runtime crash:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 pt-32">
        <div className="text-center bg-white border border-gold-medium/15 p-12 rounded-3xl max-w-md w-full luxury-shadow text-left">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="font-sansflex text-3xl font-bold text-luxury-dark mb-2 text-center">Something went wrong</h1>
          <p className="text-xs text-foreground/60 mb-8 leading-relaxed text-center">
            An unexpected error occurred while rendering this page. Our specialists have been notified and are resolving it.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-bold bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white py-4 rounded-full transition-all duration-300 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try again</span>
            </button>
            <Link
              href="/"
              className="inline-flex justify-center items-center text-xs uppercase tracking-widest font-bold border border-gold-medium/20 hover:border-gold-medium/50 text-luxury-dark py-4 rounded-full transition-all duration-300 text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
