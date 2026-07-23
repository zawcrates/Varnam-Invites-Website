"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Edit3, 
  Eye, 
  Trash2, 
  Sparkles, 
  CheckSquare, 
  Square
} from "lucide-react";
import type { Template, TemplateVisibility } from "@/types";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedVisibility !== "all") params.set("visibility", selectedVisibility);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/templates?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setTemplates(data.templates || []);
      }
    } catch (e) {
      console.error("Failed to load templates:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedVisibility, selectedCategory, search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Handle single visibility toggle
  const handleVisibilityChange = async (id: string, newVisibility: TemplateVisibility) => {
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error("Failed to update visibility:", e);
    }
  };

  // Handle template duplication
  const handleDuplicate = async (id: string) => {
    try {
      const original = templates.find((t) => t.id === id);
      if (!original) return;

      const cloneData = {
        ...original,
        name: `${original.name} (Copy)`,
        slug: `${original.slug}-copy-${Date.now().toString(36).substring(4)}`,
        visibility: "draft" as TemplateVisibility,
      };

      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cloneData),
      });

      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error("Failed to duplicate template:", e);
    }
  };

  // Handle template deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template record?")) return;
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (e) {
      console.error("Failed to delete template:", e);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: "bulk-visibility" | "bulk-delete", targetVisibility?: TemplateVisibility) => {
    if (selectedIds.length === 0) return;
    if (action === "bulk-delete" && !confirm(`Delete ${selectedIds.length} selected template(s)?`)) return;

    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ids: selectedIds,
          visibility: targetVisibility,
        }),
      });

      if (res.ok) {
        setSelectedIds([]);
        fetchTemplates();
      }
    } catch (e) {
      console.error("Bulk action failed:", e);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === templates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(templates.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-8 font-sansflex">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold-medium/15 pb-6">
        <div>
          <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-1 block">
            Admin CMS
          </span>
          <h1 className="text-3xl font-sansflex font-bold text-luxury-dark tracking-wide">
            Template Catalog
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            Manage metadata, pricing, default presets, and visibility status for your invitation templates.
          </p>
        </div>

        <Link
          href="/admin/templates/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:scale-105 border border-gold-medium/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </Link>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gold-medium/15 luxury-shadow">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gold-dark/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search template name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gold-light/20 border border-gold-medium/20 rounded-xl text-xs text-luxury-dark placeholder-foreground/40 focus:outline-none focus:border-gold-medium font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Visibility filter */}
          <div className="flex items-center gap-1.5 bg-gold-light/30 border border-gold-medium/20 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-gold-dark" />
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="bg-transparent text-luxury-dark outline-none cursor-pointer text-xs uppercase font-bold tracking-wider"
            >
              <option value="all">All Visibility</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-gold-light/30 border border-gold-medium/20 px-3 py-1.5 rounded-xl text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-luxury-dark outline-none cursor-pointer text-xs uppercase font-bold tracking-wider"
            >
              <option value="all">All Categories</option>
              <option value="Vintage">Vintage</option>
              <option value="Traditional">Traditional</option>
              <option value="Modern">Modern</option>
              <option value="Floral">Floral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-gold-light/60 border border-gold-medium/30 p-3 px-5 rounded-2xl flex justify-between items-center text-xs animate-fade-in luxury-shadow">
          <span className="font-bold text-gold-dark uppercase tracking-wider">
            {selectedIds.length} template(s) selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkAction("bulk-visibility", "published")}
              className="px-3.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shadow-xs"
            >
              Bulk Publish
            </button>
            <button
              onClick={() => handleBulkAction("bulk-visibility", "archived")}
              className="px-3.5 py-1.5 rounded-full bg-neutral-700 hover:bg-neutral-800 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shadow-xs"
            >
              Bulk Archive
            </button>
            <button
              onClick={() => handleBulkAction("bulk-delete")}
              className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shadow-xs"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white border border-gold-medium/15 rounded-2xl overflow-hidden luxury-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-luxury-dark border-collapse">
            <thead>
              <tr className="border-b border-gold-medium/15 bg-gold-light/30 uppercase text-[10px] tracking-widest text-gold-dark font-bold">
                <th className="py-4 px-5 w-10">
                  <button onClick={toggleSelectAll} className="focus:outline-none">
                    {selectedIds.length === templates.length && templates.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-gold-dark" />
                    ) : (
                      <Square className="w-4 h-4 text-gold-medium/40" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4">Template</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground/50 font-medium">
                    Loading templates...
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground/50 font-medium">
                    No templates found matching filters.
                  </td>
                </tr>
              ) : (
                templates.map((t) => {
                  const isSelected = selectedIds.includes(t.id);
                  return (
                    <tr
                      key={t.id}
                      className={`border-b border-gold-medium/10 hover:bg-gold-light/20 transition-colors ${
                        isSelected ? "bg-gold-light/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-5">
                        <button onClick={() => toggleSelectOne(t.id)} className="focus:outline-none">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-gold-dark" />
                          ) : (
                            <Square className="w-4 h-4 text-gold-medium/40" />
                          )}
                        </button>
                      </td>

                      {/* Thumbnail & Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 relative rounded-xl overflow-hidden bg-luxury-cream border border-gold-medium/15 shrink-0 shadow-xs">
                            <Image
                              src={t.thumbnail && t.thumbnail.startsWith("/") || t.thumbnail?.startsWith("http") ? t.thumbnail : "/kovil-vaibhavam/thumbnail.jpeg"}
                              alt={t.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-luxury-dark text-sm">{t.name}</span>
                            <span className="text-[10px] text-foreground/50 font-mono mt-0.5">
                              /{t.slug}
                            </span>
                            {t.featured && (
                              <span className="mt-1 text-[9px] font-bold text-gold-dark uppercase tracking-widest flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-gold-medium" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 font-semibold text-foreground/70">
                        {t.category}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-luxury-dark">₹{t.price}</span>
                          {t.originalPrice > t.price && (
                            <span className="text-[10px] text-foreground/40 line-through">
                              ₹{t.originalPrice}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Visibility Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={t.visibility || "published"}
                          onChange={(e) =>
                            handleVisibilityChange(t.id, e.target.value as TemplateVisibility)
                          }
                          className="bg-gold-light/30 border border-gold-medium/20 text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 cursor-pointer outline-none hover:border-gold-medium transition-colors text-luxury-dark"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="hidden">Hidden</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Row Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/templates/${t.slug}`}
                            target="_blank"
                            title="Preview Public Page"
                            className="p-2 rounded-xl bg-gold-light/30 hover:bg-gold-light/80 text-luxury-dark transition-colors border border-gold-medium/15"
                          >
                            <Eye className="w-3.5 h-3.5 text-gold-dark" />
                          </Link>

                          <Link
                            href={`/admin/templates/${t.id}/edit`}
                            title="Edit Metadata"
                            className="p-2 rounded-xl bg-gold-light/30 hover:bg-luxury-dark text-gold-dark hover:text-gold-light transition-colors border border-gold-medium/15"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(t.id)}
                            title="Duplicate Template Preset"
                            className="p-2 rounded-xl bg-gold-light/30 hover:bg-gold-light/80 text-luxury-dark transition-colors border border-gold-medium/15 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-gold-dark" />
                          </button>

                          <button
                            onClick={() => handleDelete(t.id)}
                            title="Delete Record"
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
