import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund Policy | Varnam Invites",
  description:
    "Official Refund and Cancellation Policy for digital wedding invitation purchases on Varnam Invites.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-left">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-dark text-xs uppercase tracking-widest font-semibold block mb-2">
            Varnam Invites Guarantees
          </span>
          <h1 className="font-sansflex text-3xl md:text-5xl text-luxury-dark font-bold tracking-tight mb-4">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs uppercase tracking-widest text-foreground/50 font-medium">
            Last Updated: July 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-gold-medium/15 rounded-3xl p-8 md:p-14 luxury-shadow space-y-8 text-foreground/80 leading-relaxed text-sm">
          
          {/* General Policy */}
          <div className="space-y-4">
            <h2 className="font-sansflex text-xl font-bold text-luxury-dark tracking-wide border-b border-gold-medium/10 pb-3">
              1. Digital Product Policy Overview
            </h2>
            <p>
              Varnam Invites provides digital wedding invitations, customization tools, and instant website hosting services.
            </p>
            <p>
              Because our products are digital goods that become accessible immediately after payment verification, purchases are generally <strong>non-refundable</strong> once the digital invitation has been delivered or published, except under the specific circumstances outlined below or required by applicable law.
            </p>
          </div>

          {/* Refund Conditions */}
          <div className="space-y-4 bg-gold-light/20 p-6 md:p-8 rounded-2xl border border-gold-medium/15">
            <h2 className="font-sansflex text-xl font-bold text-gold-dark tracking-wide">
              2. Eligible Refund Conditions
            </h2>
            <p>A refund may be requested and granted under the following circumstances:</p>

            <ul className="space-y-4 list-none pt-2">
              <li className="flex gap-3">
                <span className="text-gold-dark font-bold text-base">&bull;</span>
                <div>
                  <strong className="text-luxury-dark">Duplicate Payment Charges:</strong>
                  <p className="mt-1 text-foreground/75">
                    If your account or card was accidentally charged multiple times for the exact same order or transaction, all duplicate charges will be refunded in full after verification.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="text-gold-dark font-bold text-base">&bull;</span>
                <div>
                  <strong className="text-luxury-dark">Non-Delivery or Technical Access Failure:</strong>
                  <p className="mt-1 text-foreground/75">
                    If payment succeeded but Varnam Invites fails to provide access to your customized invitation or publish your wedding website due to a server error attributable to us, we will first attempt to resolve the issue promptly. If access cannot be restored within a reasonable period, a full refund will be issued.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="text-gold-dark font-bold text-base">&bull;</span>
                <div>
                  <strong className="text-luxury-dark">Statutory Rights:</strong>
                  <p className="mt-1 text-foreground/75">
                    Nothing in this policy limits or waives any rights or remedies that cannot legally be excluded under applicable consumer protection law.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Non-Refundable Exceptions */}
          <div className="space-y-4">
            <h2 className="font-sansflex text-xl font-bold text-luxury-dark tracking-wide border-b border-gold-medium/10 pb-3">
              3. Non-Eligible Refund Situations
            </h2>
            <p>Refunds will <strong>not</strong> be granted in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/75 pl-2">
              <li>Change of mind after successful payment and website publishing.</li>
              <li>Selecting an incorrect template design or color theme by mistake.</li>
              <li>Failure to use or share the published invitation link for your event.</li>
              <li>Errors in couple names, dates, or venue details entered by the user (these can be updated anytime for free via your project dashboard).</li>
            </ul>
          </div>

          {/* Processing Details */}
          <div className="space-y-4">
            <h2 className="font-sansflex text-xl font-bold text-luxury-dark tracking-wide border-b border-gold-medium/10 pb-3">
              4. Refund Processing &amp; Timelines
            </h2>
            <p>
              Approved refunds will be processed back to your original payment method (Credit/Debit Card, UPI, NetBanking, or Wallet).
            </p>
            <p>
              Once initiated, refund funds typically reflect in your bank account within <strong>5 to 7 business days</strong>, depending on your card issuer or banking provider.
            </p>
          </div>

          {/* Contact Support */}
          <div className="space-y-4 border-t border-gold-medium/10 pt-6">
            <h2 className="font-sansflex text-xl font-bold text-luxury-dark tracking-wide">
              5. How to Request a Refund
            </h2>
            <p>
              To initiate a refund inquiry, please contact our support team with your <strong>Order ID</strong> and payment receipt:
            </p>
            <div className="bg-luxury-cream p-4 rounded-xl border border-gold-medium/20 text-xs font-mono space-y-1">
              <p>Email: <a href="mailto:varnaminvites@gmail.com" className="text-gold-dark underline font-bold">varnaminvites@gmail.com</a></p>
              <p>Response Time: Within 24-48 business hours</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
