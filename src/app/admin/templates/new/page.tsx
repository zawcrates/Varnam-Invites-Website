"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Sparkles, Music, CheckCircle2, AlertTriangle, XCircle, FolderCheck } from "lucide-react";
import type { TemplateCategory, TemplateVisibility, RegisteredTemplateInfo } from "@/types";
import { validateTemplateForPublish } from "@/utils/templateValidation";

export default function NewTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingRegistered, setFetchingRegistered] = useState(true);
  const [registeredTemplates, setRegisteredTemplates] = useState<RegisteredTemplateInfo[]>([]);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 1499,
    originalPrice: 2499,
    rating: 5.0,
    reviewsCount: 1,
    category: "Traditional" as TemplateCategory,
    description: "",
    thumbnail: "",
    audioUrl: "",
    visibility: "draft" as TemplateVisibility,
    featured: false,
    displayOrder: 0,
    featuresText: "",
    groomName: "Aarav",
    connector: "&",
    brideName: "Ananya",
    welcomeTop: "TOGETHER WITH THEIR FAMILIES",
    andText: "AND",
    inviteText1: "CORDIALLY INVITE YOU TO CELEBRATE THEIR WEDDING",
    inviteText2: "JOIN US AS WE BEGIN OUR FOREVER",
    month: "DECEMBER",
    dateDetails: "SUNDAY | 24 | 2026",
    time: "5:00 PM ONWARDS",
    locationLine1: "The Leela Palace",
    locationLine2: "Bengaluru, Karnataka",
    mapEmbedUrl: "https://maps.google.com",
    storyText: "Our journey started five years ago...",
    whatsappNumber: "919876543210",
    metaTitle: "",
    metaDescription: "",
  });

  // Selected registered template info
  const selectedRegistered = registeredTemplates.find((r) => r.slug === formData.slug);

  // Validation Result
  const validation = validateTemplateForPublish(
    {
      slug: formData.slug,
      name: formData.name,
      price: formData.price,
      thumbnail: formData.thumbnail,
      visibility: formData.visibility,
    },
    registeredTemplates.map((r) => r.slug)
  );

  // Fetch registered templates on mount
  useEffect(() => {
    const fetchRegistered = async () => {
      setFetchingRegistered(true);
      try {
        const res = await fetch("/api/admin/registered-templates");
        const json = await res.json();
        if (res.ok && json.registeredTemplates) {
          setRegisteredTemplates(json.registeredTemplates);
        }
      } catch (e) {
        console.error("Failed to fetch registered templates:", e);
      } finally {
        setFetchingRegistered(false);
      }
    };

    fetchRegistered();
  }, []);

  const handleSelectRegistered = (slug: string) => {
    const matched = registeredTemplates.find((r) => r.slug === slug);
    if (!matched) return;

    const manifest = matched.manifest;
    setFormData((prev) => ({
      ...prev,
      slug: manifest.slug,
      name: manifest.name || prev.name,
      category: manifest.category || prev.category,
      description: manifest.description || prev.description,
      thumbnail: manifest.thumbnail || prev.thumbnail || "/kovil-vaibhavam/thumbnail.jpeg",
      featuresText: (manifest.features || []).join("\n"),
      groomName: manifest.defaultData?.groomName || prev.groomName,
      connector: manifest.defaultData?.connector || prev.connector,
      brideName: manifest.defaultData?.brideName || prev.brideName,
      welcomeTop: manifest.defaultData?.welcomeTop || prev.welcomeTop,
      andText: manifest.defaultData?.andText || prev.andText,
      inviteText1: manifest.defaultData?.inviteText1 || prev.inviteText1,
      inviteText2: manifest.defaultData?.inviteText2 || prev.inviteText2,
      month: manifest.defaultData?.month || prev.month,
      dateDetails: manifest.defaultData?.dateDetails || prev.dateDetails,
      time: manifest.defaultData?.time || prev.time,
      locationLine1: manifest.defaultData?.locationLine1 || prev.locationLine1,
      locationLine2: manifest.defaultData?.locationLine2 || prev.locationLine2,
      mapEmbedUrl: manifest.defaultData?.mapEmbedUrl || prev.mapEmbedUrl,
      whatsappNumber: manifest.defaultData?.whatsappNumber || prev.whatsappNumber,
      audioUrl: manifest.defaultData?.audioSrc || prev.audioUrl,
    }));
  };

  const handleFileUpload = async (file: File, bucket: string, field: "thumbnail" | "audioUrl") => {
    if (field === "thumbnail") setUploadingThumb(true);
    if (field === "audioUrl") setUploadingAudio(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucket", bucket);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, [field]: json.url }));
      }
    } catch (e) {
      console.error("Upload error:", e);
    } finally {
      setUploadingThumb(false);
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation.isValid) {
      alert(`Validation Error:\n\n${validation.errors.join("\n")}`);
      return;
    }

    if (formData.visibility === "published" && !validation.canPublish) {
      alert("Cannot publish until all pre-publish requirements are complete.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        rating: Number(formData.rating),
        reviewsCount: Number(formData.reviewsCount),
        category: formData.category,
        description: formData.description,
        thumbnail: formData.thumbnail,
        audioUrl: formData.audioUrl,
        visibility: formData.visibility,
        featured: formData.featured,
        displayOrder: Number(formData.displayOrder),
        features: formData.featuresText.split("\n").filter(Boolean),
        seoMetadata: {
          title: formData.metaTitle || `${formData.name} Wedding Invitation | Varnam`,
          description: formData.metaDescription || formData.description,
        },
        defaultData: {
          showPreloader: true,
          preloaderTime: 2000,
          groomName: formData.groomName,
          connector: formData.connector,
          brideName: formData.brideName,
          welcomeTop: formData.welcomeTop,
          andText: formData.andText,
          inviteText1: formData.inviteText1,
          inviteText2: formData.inviteText2,
          month: formData.month,
          dateDetails: formData.dateDetails,
          time: formData.time,
          locationLine1: formData.locationLine1,
          locationLine2: formData.locationLine2,
          mapEmbedUrl: formData.mapEmbedUrl,
          storyText: formData.storyText,
          whatsappNumber: formData.whatsappNumber,
          audioSrc: formData.audioUrl || "/audio/wedding-song.mp3",
        },
      };

      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/templates");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Failed to create template"}`);
      }
    } catch (e) {
      console.error("Submission failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-4xl mx-auto font-sansflex">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gold-medium/15 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/templates"
            className="p-2.5 rounded-xl bg-white border border-gold-medium/20 text-gold-dark hover:bg-gold-light/40 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold block">Template Metadata CMS</span>
            <h1 className="font-sansflex text-2xl font-bold text-luxury-dark tracking-wide">Connect Registered Template</h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !validation.isValid}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all border shadow-md ${
            validation.isValid && !loading
              ? "bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white border-gold-medium/20 hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving..." : "Save Template Record"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Section 1: Template Discovery & Selection */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-gold-medium" /> 1. Select Registered Template
            </h2>
            <span className="text-[10px] text-foreground/50 font-medium italic">
              Discovered in src/templates/
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">
                Registered Template Folder & Manifest
              </label>

              {fetchingRegistered ? (
                <div className="py-3 px-4 rounded-xl bg-gold-light/20 text-xs text-foreground/50 animate-pulse">
                  Scanning src/templates/ for registered renderers...
                </div>
              ) : registeredTemplates.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">No Registered Templates Found</span>
                    <p className="text-[11px] leading-relaxed text-amber-700">
                      Please copy your template folder into <code className="bg-amber-100 px-1 py-0.5 rounded">src/templates/&lt;slug&gt;/</code> and register it inside <code className="bg-amber-100 px-1 py-0.5 rounded">src/templates/index.ts</code> first.
                    </p>
                  </div>
                </div>
              ) : (
                <select
                  value={formData.slug}
                  onChange={(e) => handleSelectRegistered(e.target.value)}
                  className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-3 text-xs text-luxury-dark outline-none focus:border-gold-medium font-bold cursor-pointer"
                >
                  <option value="">-- Choose a developer-registered template --</option>
                  {registeredTemplates.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.manifest.name} ({r.slug}) {r.hasDatabaseRecord ? "• Already Cataloged" : "• New"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Read-only Manifest Badge */}
            {selectedRegistered && (
              <div className="p-4 rounded-xl bg-gold-light/30 border border-gold-medium/20 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-luxury-dark text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Manifest Verified: {selectedRegistered.manifest.name}
                  </span>
                  <span className="text-[10px] bg-luxury-dark text-gold-light px-2.5 py-0.5 rounded-full font-mono">
                    v{selectedRegistered.manifest.version}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-[11px] text-foreground/70 mt-1 pt-2 border-t border-gold-medium/15">
                  <div>
                    <span className="text-foreground/40 block text-[9px] uppercase font-bold">Slug</span>
                    <code className="font-mono text-luxury-dark font-semibold">{selectedRegistered.slug}</code>
                  </div>
                  <div>
                    <span className="text-foreground/40 block text-[9px] uppercase font-bold">Category</span>
                    <span className="font-semibold text-luxury-dark">{selectedRegistered.manifest.category}</span>
                  </div>
                  <div>
                    <span className="text-foreground/40 block text-[9px] uppercase font-bold">Author</span>
                    <span className="font-semibold text-luxury-dark">{selectedRegistered.manifest.author || "Varnam"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Validation Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-between">
            <span>2. Pre-Publish Validation Checklist</span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
              validation.canPublish ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {validation.canPublish ? "Ready to Publish" : "Draft Only"}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs">
              {validation.checks.isRegistered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span className={validation.checks.isRegistered ? "text-foreground/80 font-medium" : "text-red-600 font-semibold"}>
                Template Registered in Code ({formData.slug || "None"})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {validation.checks.nameConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span className={validation.checks.nameConfigured ? "text-foreground/80 font-medium" : "text-red-600 font-semibold"}>
                Display Name Configured
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {validation.checks.thumbnailUploaded ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className={validation.checks.thumbnailUploaded ? "text-foreground/80 font-medium" : "text-amber-700 font-medium"}>
                Thumbnail Image Uploaded
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {validation.checks.priceConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className={validation.checks.priceConfigured ? "text-foreground/80 font-medium" : "text-amber-700 font-medium"}>
                Selling Price Configured (&gt; ₹0)
              </span>
            </div>
          </div>

          {validation.errors.length > 0 && (
            <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <span className="font-bold block mb-1">Missing Requirements:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                {validation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 3: Marketing & Pricing */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark">
            3. Catalog & Pricing Metadata
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Template Display Name</label>
              <input
                type="text"
                placeholder="e.g. Kovil Vaibhavam Scroll"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Selling Price (₹ INR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Original Price (₹ INR)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as TemplateCategory }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              >
                <option value="Vintage">Vintage</option>
                <option value="Traditional">Traditional</option>
                <option value="Modern">Modern</option>
                <option value="Floral">Floral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Visibility Status</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData((prev) => ({ ...prev, visibility: e.target.value as TemplateVisibility }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published" disabled={!validation.canPublish}>
                  Published {!validation.canPublish ? "(Complete Requirements First)" : "(Public Catalog)"}
                </option>
                <option value="hidden">Hidden (Link only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Short Description</label>
              <textarea
                rows={3}
                placeholder="A luxury temple-themed wedding invitation..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl p-4 text-xs text-luxury-dark outline-none focus:border-gold-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-gold-dark cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs text-luxury-dark font-bold cursor-pointer">
                Highlight on Homepage Featured Carousel
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Asset Uploaders */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark">
            4. Media Assets (Thumbnail & Audio)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-foreground/70 font-semibold uppercase tracking-wider">Thumbnail Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/templates/kovil-vaibhavam-thumb.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                  className="flex-grow bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2 text-xs text-luxury-dark outline-none font-medium"
                />
                <label className="px-4 py-2 rounded-xl bg-luxury-dark hover:bg-gold-dark text-xs font-bold text-gold-light uppercase tracking-wider cursor-pointer inline-flex items-center gap-1 shrink-0 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingThumb ? "..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "template-thumbnails", "thumbnail");
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-foreground/70 font-semibold uppercase tracking-wider">Background Audio Track URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/bg_music.mp3"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, audioUrl: e.target.value }))}
                  className="flex-grow bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2 text-xs text-luxury-dark outline-none font-medium"
                />
                <label className="px-4 py-2 rounded-xl bg-luxury-dark hover:bg-gold-dark text-xs font-bold text-gold-light uppercase tracking-wider cursor-pointer inline-flex items-center gap-1 shrink-0 shadow-xs">
                  <Music className="w-3.5 h-3.5" />
                  <span>{uploadingAudio ? "..." : "Upload MP3"}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "template-audio", "audioUrl");
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/templates"
            className="px-6 py-2.5 rounded-full bg-gold-light/40 hover:bg-gold-light text-luxury-dark font-bold text-xs uppercase tracking-wider border border-gold-medium/20"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading || !validation.isValid}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all border shadow-md ${
              validation.isValid && !loading
                ? "bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white border-gold-medium/20 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
            }`}
          >
            {loading ? "Saving..." : "Create Template Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
