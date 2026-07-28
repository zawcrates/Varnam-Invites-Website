/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../AdminSidebar";
import { createClient } from "@/lib/supabase/browser";
import {
  Crown,
  RefreshCw,
  MessageCircle,
  Loader2,
  ChevronDown,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import type { PremiumArtworkStatus } from "@/types";

interface PremiumRequest {
  id: string;
  template_slug: string;
  custom_artwork_requested?: boolean | null;
  custom_artwork_status?: PremiumArtworkStatus | null;
  updated_at?: string | null;
  created_at?: string | null;
  draft_data?: {
    groomName?: string;
    brideName?: string;
    month?: string;
    dateDetails?: string;
    whatsappNumber?: string;
    customerName?: string;
  } | null;
}

const STATUS_OPTIONS: { value: PremiumArtworkStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "delivered", label: "Delivered" },
];

const STATUS_STYLES: Record<PremiumArtworkStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delivered: "bg-purple-50 text-purple-700 border-purple-200",
};

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PremiumRequestsPage() {
  const [requests, setRequests] = useState<PremiumRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setRequests(data as unknown as PremiumRequest[]);
      }
    } catch (e) {
      console.error("Failed to load premium requests:", e);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (
    id: string,
    newStatus: PremiumArtworkStatus
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/premium-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, custom_artwork_status: newStatus } : r
          )
        );
      }
    } catch (e) {
      console.error("Status update failed:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "requested") return r.custom_artwork_requested === true;
    return (r.custom_artwork_status || "pending") === filterStatus;
  });

  const whatsappPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916379237294";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f7f5f0] text-luxury-dark">
      <AdminSidebar />

      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-luxury-dark flex items-center gap-2">
              <Crown className="w-6 h-6 text-gold-dark" />
              Premium Couple Requests
            </h1>
            <p className="text-xs text-foreground/60 mt-1">
              Track and manage Premium Couple Personalization requests from customers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gold-medium/20 rounded-xl px-4 py-2 text-xs font-semibold text-luxury-dark outline-none focus:border-gold-dark"
            >
              <option value="all">All Projects</option>
              <option value="requested">Artwork Requested</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              onClick={fetchRequests}
              className="p-2.5 bg-white border border-gold-medium/20 hover:border-gold-dark rounded-xl text-luxury-dark transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin text-gold-dark" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Projects",
              value: requests.length,
              color: "text-luxury-dark",
            },
            {
              label: "Artwork Requested",
              value: requests.filter((r) => r.custom_artwork_requested).length,
              color: "text-gold-dark",
            },
            {
              label: "In Progress",
              value: requests.filter((r) => r.custom_artwork_status === "in_progress").length,
              color: "text-blue-600",
            },
            {
              label: "Delivered",
              value: requests.filter((r) => r.custom_artwork_status === "delivered").length,
              color: "text-purple-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white border border-gold-medium/15 rounded-2xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] uppercase tracking-wider text-foreground/50 font-semibold mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-gold-medium/15 rounded-2xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-gold-dark" />
            <p className="text-xs text-foreground/50">Loading requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gold-medium/15 rounded-2xl p-12 text-center text-foreground/50">
            <Crown className="w-10 h-10 text-gold-medium/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-luxury-dark mb-1">
              No requests found
            </p>
            <p className="text-xs">No projects match the selected filter.</p>
          </div>
        ) : (
          <div className="bg-white border border-gold-medium/15 rounded-2xl overflow-x-auto shadow-sm">
            <div className="min-w-[640px]">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-3 bg-gold-light/20 border-b border-gold-medium/10 text-[10px] uppercase tracking-widest font-bold text-foreground/50">
              <span>Customer</span>
              <span>Template & Date</span>
              <span className="text-center">Artwork</span>
              <span className="text-center">Status</span>
              <span className="text-center">WhatsApp</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gold-medium/8">
              {filtered.map((req) => {
                const draft = req.draft_data || {};
                const bride = draft.brideName || "Bride";
                const groom = draft.groomName || "Groom";
                const weddingDate = [draft.month, draft.dateDetails]
                  .filter(Boolean)
                  .join(" · ");
                const status =
                  req.custom_artwork_status || "pending";
                const isUpdating = updatingId === req.id;

                const waMessage = encodeURIComponent(
                  `Hi! I'm following up on the Premium Couple Artwork request for ${groom} & ${bride} (${req.template_slug}).`
                );
                const waUrl = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=${waMessage}`;

                return (
                  <div
                    key={req.id}
                    className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-gold-light/5 transition-colors"
                  >
                    {/* Customer */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gold-light border border-gold-medium/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-gold-dark" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-luxury-dark truncate">
                          {groom} &amp; {bride}
                        </p>
                        <p className="text-[10px] text-foreground/40 font-mono truncate">
                          {req.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>

                    {/* Template & Date */}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-luxury-dark truncate">
                        {req.template_slug}
                      </p>
                      <p className="text-[10px] text-foreground/50 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 shrink-0" />
                        {weddingDate || formatDate(req.created_at)}
                      </p>
                    </div>

                    {/* Artwork Requested */}
                    <div className="flex justify-center">
                      {req.custom_artwork_requested ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold-dark bg-gold-light/40 border border-gold-medium/20 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Requested
                        </span>
                      ) : (
                        <span className="text-[10px] text-foreground/30 font-medium">—</span>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <select
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(
                              req.id,
                              e.target.value as PremiumArtworkStatus
                            )
                          }
                          disabled={isUpdating}
                          className={`appearance-none text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 pr-7 rounded-full border cursor-pointer outline-none transition-all ${STATUS_STYLES[status as PremiumArtworkStatus] || STATUS_STYLES.pending} disabled:opacity-60`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isUpdating ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <ChevronDown className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex justify-center">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center transition-colors"
                        title={`Chat with ${groom} & ${bride}`}
                      >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
