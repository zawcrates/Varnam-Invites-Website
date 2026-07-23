"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Music, Upload, CheckCircle2, XCircle, AlertTriangle, FolderCheck } from "lucide-react";
import type { TemplateCategory, TemplateVisibility, RegisteredTemplateInfo } from "@/types";
import { validateTemplateForPublish } from "@/utils/templateValidation";

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [registeredTemplates, setRegisteredTemplates] = useState<RegisteredTemplateInfo[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 1499,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 12,
    category: "Traditional" as TemplateCategory,
    description: "",
    thumbnail: "",
    audioUrl: "",
    visibility: "published" as TemplateVisibility,
    featured: false,
    displayOrder: 0,
    featuresText: "",
    groomName: "Aarav",
    connector: "&",
    brideName: "Ananya",
    welcomeTop: "TOGETHER WITH THEIR FAMILIES",
    andText: "INVITE YOU TO CELEBRATE THEIR WEDDING",
    inviteText1: "JOIN US AS WE BEGIN OUR FOREVER",
    inviteText2: "YOUR PRESENCE IS OUR GREATEST GIFT",
    month: "DECEMBER",
    dateDetails: "24 | 2026",
    time: "5:00 PM ONWARDS",
    locationLine1: "The Leela Palace",
    locationLine2: "Bengaluru, Karnataka",
    mapEmbedUrl: "https://maps.google.com",
    storyText: "",
    whatsappNumber: "",
    metaTitle: "",
    metaDescription: "",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [regRes, tplRes] = await Promise.all([
          fetch("/api/admin/registered-templates"),
          fetch(`/api/admin/templates/${templateId}`),
        ]);

        const regData = await regRes.json();
        if (regRes.ok && regData.registeredTemplates) {
          setRegisteredTemplates(regData.registeredTemplates);
        }

        const tplData = await tplRes.json();
        if (tplRes.ok && tplData.template) {
          const t = tplData.template;
          setFormData({
            name: t.name || "",
            slug: t.slug || "",
            price: t.price || 0,
            originalPrice: t.originalPrice || 0,
            rating: t.rating || 5,
            reviewsCount: t.reviewsCount || 0,
            category: t.category || "Traditional",
            description: t.description || "",
            thumbnail: t.thumbnail || "",
            audioUrl: t.audioUrl || "",
            visibility: t.visibility || "published",
            featured: t.featured || false,
            displayOrder: t.displayOrder || 0,
            featuresText: (t.features || []).join("\n"),
            groomName: t.defaultData?.groomName || "Aarav",
            connector: t.defaultData?.connector || "&",
            brideName: t.defaultData?.brideName || "Ananya",
            welcomeTop: t.defaultData?.welcomeTop || "",
            andText: t.defaultData?.andText || "",
            inviteText1: t.defaultData?.inviteText1 || "",
            inviteText2: t.defaultData?.inviteText2 || "",
            month: t.defaultData?.month || "",
            dateDetails: t.defaultData?.dateDetails || "",
            time: t.defaultData?.time || "",
            locationLine1: t.defaultData?.locationLine1 || "",
            locationLine2: t.defaultData?.locationLine2 || "",
            mapEmbedUrl: t.defaultData?.mapEmbedUrl || "",
            storyText: t.defaultData?.storyText || "",
            whatsappNumber: t.defaultData?.whatsappNumber || "",
            metaTitle: t.seoMetadata?.title || "",
            metaDescription: t.seoMetadata?.description || "",
          });
        }
      } catch (e) {
        console.error("Failed to load template editor data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId]);

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

    if (formData.visibility === "published" && !validation.canPublish) {
      alert(`Cannot publish until requirements are complete:\n\n${validation.errors.join("\n")}`);
      return;
    }

    setSaving(true);
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
          title: formData.metaTitle,
          description: formData.metaDescription,
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

      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/templates");
      }
    } catch (e) {
      console.error("Update failed:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-foreground/50 font-medium">Loading template metadata editor...</div>;
  }

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
            <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold block">Edit Template Metadata</span>
            <h1 className="font-sansflex text-2xl font-bold text-luxury-dark tracking-wide">{formData.name}</h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 border border-gold-medium/20 shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Update Template"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Section 1: Template Code Binding */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-gold-medium" /> Registered Template Binding
            </span>
            <span className="text-[10px] bg-gold-light/40 text-gold-dark font-mono px-3 py-1 rounded-full font-bold">
              slug: {formData.slug}
            </span>
          </h2>

          <div className="p-4 rounded-xl bg-gold-light/20 border border-gold-medium/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {validation.checks.isRegistered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              <span className="font-semibold text-luxury-dark">
                {validation.checks.isRegistered
                  ? `Bound to Developer Component: src/templates/${formData.slug}/`
                  : `Warning: Slug '${formData.slug}' is not registered in src/templates/index.ts`}
              </span>
            </div>
            <span className="text-[10px] text-foreground/50 font-medium italic">
              React code is developer-controlled
            </span>
          </div>
        </div>

        {/* Section 2: Validation Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-between">
            <span>Pre-Publish Validation Status</span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
              validation.canPublish ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {validation.canPublish ? "Ready to Publish" : "Draft Mode"}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              {validation.checks.isRegistered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span className={validation.checks.isRegistered ? "text-foreground/80 font-medium" : "text-red-600 font-semibold"}>
                Registered Component ({formData.slug})
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

            <div className="flex items-center gap-2 text-xs">
              {validation.checks.nameConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span className={validation.checks.nameConfigured ? "text-foreground/80 font-medium" : "text-red-600 font-semibold"}>
                Display Name Set
              </span>
            </div>
          </div>
        </div>

        {/* Marketing Details */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-medium" /> Catalog Metadata Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Slug (Read-Only)</label>
              <input
                type="text"
                value={formData.slug}
                disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-500 font-mono font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Price (₹ INR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Visibility Status</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData((prev) => ({ ...prev, visibility: e.target.value as TemplateVisibility }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl px-4 py-2.5 text-xs text-luxury-dark outline-none focus:border-gold-medium font-semibold"
              >
                <option value="published" disabled={!validation.canPublish}>
                  Published {!validation.canPublish ? "(Complete Requirements First)" : ""}
                </option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-foreground/70 font-semibold uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gold-light/20 border border-gold-medium/20 rounded-xl p-4 text-xs text-luxury-dark outline-none focus:border-gold-medium"
              />
            </div>
          </div>
        </div>

        {/* Media Asset Management */}
        <div className="bg-white p-6 rounded-2xl border border-gold-medium/15 luxury-shadow flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-dark">
            Media Assets (Thumbnail & Audio)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-foreground/70 font-semibold uppercase tracking-wider">Thumbnail Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
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
            disabled={saving}
            className="px-8 py-3 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 border border-gold-medium/20 shadow-md"
          >
            {saving ? "Saving..." : "Update Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
