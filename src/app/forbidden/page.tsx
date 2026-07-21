import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldAlert, Home } from 'lucide-react';
import { buildPageMetadata } from '@/features/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'Access Denied',
  description: 'You do not have permission to access this page. Please sign in with correct credentials.',
  noindex: true,
});

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 pt-32">
        <div className="text-center bg-white border border-gold-medium/15 p-12 rounded-3xl max-w-md w-full luxury-shadow text-left">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="font-sansflex text-3xl font-bold text-luxury-dark mb-2 text-center">403 - Access Denied</h1>
          <p className="text-xs text-foreground/60 mb-8 leading-relaxed text-center">
            You do not have authorization to view this resource. Try logging out and signing in with a different account.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-bold bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white py-4 rounded-full transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
