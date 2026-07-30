import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Sparkles, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO_CATEGORIES } from "@/data/seoCategories";
import { TEMPLATES } from "@/data/templates";
import { constructMetadata } from "@/lib/seo.config";
import { ServiceJsonLd, FAQJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SEO_CATEGORIES).map((slug) => ({
    category: slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const data = SEO_CATEGORIES[category];

  if (!data) return constructMetadata({ title: "Page Not Found", noIndex: true });

  return constructMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/invitations/${category}`,
    keywords: data.keywords,
  });
}

export default async function CategorySeoPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = SEO_CATEGORIES[category];

  if (!categoryData) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Invitations", url: "/templates" },
    { name: categoryData.title, url: `/invitations/${category}` },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Structured Data */}
      <ServiceJsonLd
        name={categoryData.title}
        description={categoryData.metaDescription}
        url={`/invitations/${category}`}
      />
      <FAQJsonLd faqs={categoryData.faqs} />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
          <nav className="flex text-xs text-foreground/50 space-x-2 font-mono">
            <Link href="/" className="hover:text-gold-dark transition-colors">Home</Link>
            <span>/</span>
            <Link href="/templates" className="hover:text-gold-dark transition-colors">Templates</Link>
            <span>/</span>
            <span className="text-luxury-dark font-semibold">{categoryData.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
          <div className="bg-gradient-to-br from-gold-light/40 via-white to-gold-light/20 border border-gold-medium/20 rounded-3xl p-8 md:p-16 luxury-shadow text-center max-w-4xl mx-auto relative overflow-hidden">
            <span className="inline-flex items-center gap-1.5 bg-gold-dark/10 border border-gold-dark/20 text-gold-dark text-xs uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {categoryData.heroBadge}
            </span>

            <h1 className="font-sansflex text-3xl sm:text-5xl font-bold text-luxury-dark tracking-tight leading-[1.15] mb-6">
              {categoryData.h1}
            </h1>

            <p className="text-base sm:text-lg text-foreground/75 leading-relaxed max-w-2xl mx-auto mb-10">
              {categoryData.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-sansflex text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:scale-105"
              >
                <span>Browse All Templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gold-light/20 text-luxury-dark border border-gold-medium/30 font-sansflex text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all"
              >
                <span>View Pricing</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-sansflex text-2xl md:text-4xl font-bold text-luxury-dark mb-4">
              Why Choose Our {categoryData.title}?
            </h2>
            <p className="text-sm text-foreground/65">
              Everything you need for a modern, stress-free wedding invitation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoryData.features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white border border-gold-medium/15 rounded-2xl p-8 luxury-shadow flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gold-light/50 border border-gold-medium/20 flex items-center justify-center text-gold-dark shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sansflex font-bold text-base text-luxury-dark mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Templates Gallery */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-gold-dark text-xs uppercase tracking-widest font-bold block mb-1">
                Handcrafted Designs
              </span>
              <h2 className="font-sansflex text-2xl md:text-4xl font-bold text-luxury-dark">
                Featured Invitation Templates
              </h2>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-gold-dark hover:text-luxury-dark flex items-center gap-1 transition-colors"
            >
              <span>Explore All Designs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-gold-medium/15 rounded-2xl overflow-hidden luxury-shadow group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-luxury-cream overflow-hidden">
                  <Image
                    src={template.thumbnail}
                    alt={`${template.name} - ${categoryData.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Link
                      href={`/templates/${template.slug}`}
                      className="w-full text-center bg-white text-luxury-dark font-sansflex text-xs uppercase tracking-widest font-bold py-3 rounded-full shadow-lg"
                    >
                      Preview &amp; Customize
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] text-gold-dark uppercase tracking-widest font-semibold block mb-1">
                    {template.category} Style
                  </span>
                  <h3 className="font-sansflex font-bold text-lg text-luxury-dark mb-2">
                    {template.name}
                  </h3>
                  <div className="flex items-baseline justify-between border-t border-gold-medium/10 pt-3">
                    <span className="text-xs text-foreground/50">Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs line-through text-foreground/40">₹{template.originalPrice}</span>
                      <span className="font-sansflex font-bold text-base text-gold-dark">₹{template.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category FAQs */}
        {categoryData.faqs.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 md:px-12 mb-24">
            <div className="text-center mb-12">
              <span className="text-gold-dark text-xs uppercase tracking-widest font-bold block mb-1">
                Got Questions?
              </span>
              <h2 className="font-sansflex text-2xl md:text-4xl font-bold text-luxury-dark">
                {categoryData.title} FAQ
              </h2>
            </div>

            <div className="space-y-4">
              {categoryData.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gold-medium/15 rounded-2xl p-6 md:p-8 luxury-shadow text-left"
                >
                  <h3 className="font-sansflex font-bold text-base text-luxury-dark mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gold-dark shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-foreground/75 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cross-linking Category Cloud */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
          <div className="bg-gold-light/30 border border-gold-medium/15 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="font-sansflex font-bold text-lg text-luxury-dark mb-6">
              Explore More Invitation Categories
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Object.entries(SEO_CATEGORIES).map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/invitations/${key}`}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${
                    key === category
                      ? "bg-luxury-dark text-gold-light border-luxury-dark font-bold"
                      : "bg-white border-gold-medium/20 text-foreground/70 hover:border-gold-dark hover:text-luxury-dark"
                  }`}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
