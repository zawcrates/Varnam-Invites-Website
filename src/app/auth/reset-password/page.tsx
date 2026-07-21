import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { buildPageMetadata } from '@/features/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'Reset Account Password',
  description: 'Enter your new password to securely restore access to your Varnam Invites account.',
  noindex: true, // Do not index this page on search engines
});

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 pt-32 pb-24">
        <ResetPasswordForm />
      </main>

      <Footer />
    </div>
  );
}
