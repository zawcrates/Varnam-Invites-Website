import React from "react";
import { notFound } from "next/navigation";
import { TEMPLATES } from "@/data/templates";
import { constructMetadata } from "@/lib/seo.config";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import TemplateDetailsClient from "./TemplateDetailsClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    return constructMetadata({ title: "Template Not Found", noIndex: true });
  }

  return constructMetadata({
    title: `${template.name} - Digital Wedding Invitation Template`,
    description: `Preview and customize ${template.name}, a ${template.category.toLowerCase()} digital wedding invitation template. Includes background music, Google Maps directions, RSVP, and instant mobile sharing.`,
    path: `/templates/${template.slug}`,
    image: template.thumbnail,
    keywords: [
      template.name,
      `${template.category} wedding invitation`,
      "digital wedding card template",
      "customizable wedding website",
    ],
  });
}

export default async function TemplateDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Templates", url: "/templates" },
    { name: template.name, url: `/templates/${template.slug}` },
  ];

  return (
    <>
      <ProductJsonLd
        name={template.name}
        description={template.description}
        image={template.thumbnail}
        price={template.price}
        slug={template.slug}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <TemplateDetailsClient slug={slug} />
    </>
  );
}
