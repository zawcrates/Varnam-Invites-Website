import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy, Terms & Conditions & Refund Policy | Varnam Invites",
  description:
    "Read the official Privacy Policy, Terms & Conditions, License terms and Refund Policy for Varnam Invites digital wedding invitations.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto w-full text-left">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-dark text-xs uppercase tracking-widest font-semibold block mb-2">
            Legal &amp; Policy Agreements
          </span>
          <h1 className="font-sansflex text-3xl md:text-5xl text-luxury-dark font-bold tracking-tight mb-4">
            Privacy Policy, Terms &amp; Refund Policy
          </h1>
          <p className="text-xs uppercase tracking-widest text-foreground/50 font-medium">
            Last Updated: July 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-gold-medium/15 rounded-3xl p-8 md:p-14 luxury-shadow space-y-10 text-foreground/80 leading-relaxed text-sm">
          {/* Welcome Intro */}
          <div className="border-b border-gold-medium/10 pb-8 space-y-4">
            <p>
              Varnam Invites provides digital wedding invitations, invitation templates, customization tools and related digital services through our website.
            </p>
            <p className="text-xs bg-gold-light/40 border-l-4 border-gold-dark p-4 rounded-r-xl text-luxury-dark font-medium">
              By accessing our website, creating an account, purchasing a product, customizing an invitation, or using our services, you agree to the policies and terms described below.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              1. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, the original designs, layouts, illustrations, animations, graphics, website elements, invitation templates, branding, text and other creative materials made available by Varnam Invites are owned by or licensed to Varnam Invites and/or their respective creators.
            </p>
            <p>
              These materials may be protected under applicable intellectual-property laws, including the Copyright Act, 1957 and other applicable Indian laws.
            </p>
            <p>
              Purchasing an invitation or template does not transfer ownership of the underlying design or intellectual property to the customer.
            </p>
            <p>
              You may not reproduce, resell, redistribute, sublicense, publish, commercially exploit, extract, clone or make our templates available to others except where we have expressly permitted it in writing.
            </p>
            <p>
              Third-party fonts, illustrations, photographs, icons, software, music or other assets, where used, remain subject to the rights and licences of their respective owners.
            </p>
            <div className="pt-2">
              <h3 className="font-semibold text-luxury-dark mb-1">Varnam Invites Brand</h3>
              <p>
                &ldquo;Varnam Invites&rdquo;, its logo and associated brand elements are used to identify our services.
              </p>
              <p>
                Unless expressly stated otherwise, Varnam Invites is not represented as a registered trademark.
              </p>
              <p>
                Nothing on this website should be interpreted as claiming trademark registration where no such registration exists.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              2. Information We Collect
            </h2>
            <p>Depending on how you use Varnam Invites, we may collect information such as:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-foreground/75">
              <li>Name and contact information, including email address</li>
              <li>Account and authentication information</li>
              <li>Wedding/event information that you voluntarily provide for your invitation</li>
              <li>Customization information and saved invitation data</li>
              <li>Order and transaction information</li>
              <li>Customer-support communications</li>
              <li>Basic technical, security and usage information necessary to operate and protect the service</li>
              <li>Billing or other information required by our payment providers</li>
            </ul>
            <p className="text-xs italic text-foreground/60 pt-1">
              Payment-card, bank and UPI credentials are handled by the applicable payment provider. We do not intentionally store complete card or banking credentials on our own servers.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              3. How We Use Your Information
            </h2>
            <p>
              We may use information collected through Varnam Invites to operate the website and accounts, save invitation customizations, process purchases, publish purchased invitations, provide customer support, prevent fraud and abuse, improve reliability, meet legal/accounting obligations and communicate important information about your orders or account.
            </p>
            <p className="font-semibold text-luxury-dark">
              We do not sell your personal information to third parties for advertising.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              4. Third-Party Services
            </h2>
            <p>
              Varnam Invites relies on third-party technology providers to operate parts of the service.
            </p>
            <p>
              These may include payment processors, hosting providers, database and authentication providers, email providers, analytics services and other infrastructure providers.
            </p>
            <p>
              For example, if Razorpay is offered during checkout, payment information is processed according to Razorpay&apos;s official policies.
            </p>
            <p>
              These providers may process information according to their own terms and privacy policies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              5. Cookies and Local Storage
            </h2>
            <p>
              Varnam Invites may use cookies, browser storage or similar technologies where necessary for features such as authentication, sessions, security, saved preferences and application functionality.
            </p>
            <p>
              If we introduce optional analytics, advertising or other non-essential tracking technologies, this policy may be updated accordingly and consent mechanisms may be provided where required.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              6. Invitation and Event Information
            </h2>
            <p>
              Customers may provide names, dates, venues, photographs, event details and other content when creating an invitation.
            </p>
            <p>
              You are responsible for ensuring that you have the necessary rights or permission to upload and publish the content you provide to Varnam Invites.
            </p>
            <p>
              Because published invitations may be accessible through a shareable URL, customers should avoid including sensitive information that they do not want recipients or other people with access to the URL to see.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              7. License for Purchased Invitations
            </h2>
            <p>
              When you purchase an eligible Varnam Invites template, you receive a limited, non-exclusive and non-transferable licence to use the purchased design for the wedding or personal event associated with that purchase.
            </p>
            <p>Unless Varnam expressly permits otherwise, you may not:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-foreground/75">
              <li>Resell the template or invitation</li>
              <li>Redistribute its source files or assets</li>
              <li>Share access for unrelated events</li>
              <li>Repackage the design as your own product</li>
              <li>Sell substantially identical copies of the design</li>
              <li>Use the template as inventory for an agency or commercial template business</li>
            </ul>
            <p>
              A purchase gives you permission to use the product under these terms; it does not transfer ownership of Varnam&apos;s underlying intellectual property.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              8. Digital Products and Delivery
            </h2>
            <p>
              Varnam Invites provides digital products and services. Unless explicitly stated otherwise, no physical product will be shipped.
            </p>
            <p>
              After successful payment, eligible products may become available through your Varnam account, project dashboard, published invitation URL, email, or another digital delivery method specified during checkout.
            </p>
            <p>
              Delivery may occasionally be delayed because of payment verification, maintenance or technical issues.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              9. Pricing and Payments
            </h2>
            <p>
              Prices displayed on Varnam Invites are shown in the applicable currency indicated during checkout.
            </p>
            <p>
              Payment must be successfully authorized before paid functionality or products are delivered.
            </p>
            <p>
              Payment processing may be performed by third-party payment providers. Varnam Invites does not guarantee the availability of every payment method at all times.
            </p>
            <p>
              Any applicable taxes, charges or currency-conversion fees will be handled or displayed as required.
            </p>
          </section>

          {/* Section 10 - Refund Policy */}
          <section className="space-y-3 bg-gold-light/20 p-6 rounded-2xl border border-gold-medium/15">
            <h2 className="font-sansflex text-lg font-bold text-gold-dark tracking-wide">
              10. Refund and Cancellation Policy
            </h2>
            <p>
              Because Varnam Invites provides digital products that may become accessible immediately after purchase, purchases are generally non-refundable once the purchased digital product or invitation has been successfully delivered or made accessible, except where a refund is required by applicable law.
            </p>
            <p className="font-semibold text-luxury-dark pt-1">A refund may be considered where:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>A duplicate payment was made:</strong> If the same order was accidentally charged more than once, the duplicate transaction may be refunded after verification.
              </li>
              <li>
                <strong>Payment succeeded but access was not provided:</strong> If payment was successfully completed but Varnam fails to provide access because of a technical problem attributable to us, we will first attempt to resolve the issue. If we cannot provide the purchased product or service within a reasonable period, a refund may be considered.
              </li>
              <li>
                <strong>Other situations required by law:</strong> Nothing in this policy removes rights or remedies that cannot legally be excluded under applicable consumer-protection law.
              </li>
            </ul>
            <p className="text-xs text-foreground/60 pt-2">
              A change of mind after successful delivery, dissatisfaction resulting solely from choosing the wrong template, or failure to use the purchased invitation will generally not qualify for a refund.
            </p>
            <p className="text-xs font-medium text-luxury-dark">
              Approved refunds will normally be returned through the original payment method, subject to payment-provider processing times.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              11. User Accounts
            </h2>
            <p>
              You are responsible for keeping your login credentials secure and for activity conducted through your account.
            </p>
            <p>
              You must provide accurate information and must not attempt to gain unauthorized access to another person&apos;s account, invitation or administrative functionality.
            </p>
            <p>
              We may suspend or restrict accounts where reasonably necessary to address fraud, security threats, abuse or material violations of these Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              12. Acceptable Use
            </h2>
            <p>
              You must not use Varnam Invites to upload or distribute unlawful material, infringe another person&apos;s intellectual property, impersonate another person, interfere with the operation or security of the website, attempt unauthorized access, conduct fraudulent transactions or use the service in violation of applicable law.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              13. Availability of the Service
            </h2>
            <p>
              We aim to keep Varnam Invites available and reliable, but continuous or error-free availability cannot be guaranteed.
            </p>
            <p>
              The service may temporarily become unavailable because of maintenance, hosting issues, payment-provider outages, software updates, internet failures or circumstances outside our reasonable control.
            </p>
            <p>
              We may modify, discontinue or replace features where reasonably necessary.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              14. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Varnam Invites will not be liable for indirect, incidental, special or consequential losses resulting from use of the service.
            </p>
            <p>
              Where liability cannot legally be excluded, our liability relating to a purchased product will, to the extent permitted by law, be limited to the amount paid for the relevant product or service.
            </p>
            <p>
              Nothing in these Terms excludes liability or consumer rights that cannot lawfully be excluded or limited.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              15. Data Retention and Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to protect personal information handled through Varnam Invites.
            </p>
            <p>
              Information may be retained for as long as reasonably necessary to provide the service, maintain customer accounts, process transactions, prevent fraud, resolve disputes and meet applicable legal, tax and accounting requirements.
            </p>
            <p className="italic text-foreground/60">
              No online system can guarantee absolute security.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              16. Your Privacy Rights
            </h2>
            <p>
              Subject to applicable Indian data-protection law and its commencement provisions, users may have rights concerning their personal data, including rights relating to access, correction, updating, erasure and grievance redressal.
            </p>
            <p>
              Requests concerning personal information can be submitted through the contact method provided on the Varnam Invites website.
            </p>
            <p className="text-xs text-foreground/60">
              India notified the Digital Personal Data Protection Rules, 2025 in November 2025, with different provisions having phased commencement dates.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              17. Children&apos;s Privacy
            </h2>
            <p>
              Varnam Invites is intended for people capable of entering into transactions for wedding and event-related services.
            </p>
            <p>
              Where the processing of children&apos;s personal data is subject to special requirements under applicable law, we will handle such information in accordance with those requirements.
            </p>
          </section>

          {/* Section 18 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              18. Copyright Complaints
            </h2>
            <p>
              If you believe content available through Varnam Invites infringes intellectual property that you own or are authorized to represent, contact us with sufficient information to identify the copyrighted work and the allegedly infringing material.
            </p>
            <p>
              We may investigate and remove or restrict material where appropriate.
            </p>
          </section>

          {/* Section 19 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              19. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of India.
            </p>
            <p>
              Any disputes relating to Varnam Invites will be subject to the jurisdiction of the competent courts applicable to the business/operator, subject to any rights or jurisdiction available to consumers under applicable law.
            </p>
          </section>

          {/* Section 20 */}
          <section className="space-y-3">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              20. Changes to These Policies
            </h2>
            <p>
              We may update these Privacy Policy, Terms &amp; Conditions and Refund Policy from time to time to reflect changes to Varnam Invites, our payment or infrastructure providers, or applicable legal requirements.
            </p>
            <p>
              The latest version will be published on the website together with its updated effective date.
            </p>
          </section>

          {/* Section 21 */}
          <section className="space-y-3 border-t border-gold-medium/10 pt-6">
            <h2 className="font-sansflex text-lg font-bold text-luxury-dark tracking-wide">
              21. Contact
            </h2>
            <p>
              Questions about orders, refunds, privacy or these Terms can be submitted through the Varnam Invites Contact page or our published support email address at <strong>varnaminvites@gmail.com</strong>.
            </p>
          </section>

          {/* Footer Notice */}
          <div className="text-center pt-8 border-t border-gold-medium/10 text-xs text-foreground/50 space-y-1">
            <p>&copy; 2026 Varnam Invites. All rights reserved.</p>
            <p>
              Original Varnam Invites designs and content may not be copied, reproduced, redistributed or commercially exploited except as expressly permitted by us or applicable law.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
