"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getTemplateRenderer, getTemplateManifest } from "@/templates";
import { InviteData, TEMPLATES } from "@/data/templates";
import { TemplateService } from "@/services/TemplateService";
import WatermarkOverlay from "@/components/WatermarkOverlay";

function InvitationPreviewContent() {
  const searchParams = useSearchParams();

  // Extract parameters
  const templateSlug = searchParams.get("template") || "kovil-vaibhavam";
  const manifest = getTemplateManifest(templateSlug);
  const staticRecord = TEMPLATES.find((t) => t.slug === templateSlug);

  const [liveDefaultData, setLiveDefaultData] = useState<Partial<InviteData>>(
    manifest?.defaultData || staticRecord?.defaultData || {}
  );
  const [localCustomData, setLocalCustomData] = useState<Partial<InviteData> | null>(null);

  useEffect(() => {
    async function loadLiveTemplate() {
      try {
        const live = await TemplateService.getBySlug(templateSlug);
        if (live && live.defaultData && Object.keys(live.defaultData).length > 0) {
          setLiveDefaultData(live.defaultData);
        }
      } catch (e) {
        console.error("Failed to load live template data for preview:", e);
      }
    }
    loadLiveTemplate();
  }, [templateSlug]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("varnam_active_custom_data");
      if (stored) {
        setLocalCustomData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local custom data for preview:", e);
    }
  }, []);

  const defaultData = liveDefaultData;
  const activeCustom = localCustomData || {};

  const eventsParam = searchParams.get("events");
  let parsedEvents = undefined;
  if (eventsParam) {
    try {
      parsedEvents = JSON.parse(eventsParam);
    } catch (e) {
      console.error("Failed to parse events JSON parameter", e);
    }
  }

  // Reconstruct inviteData prioritizing: URL searchParams -> active user customData -> template defaultData
  const inviteData: Partial<InviteData> = {
    showPreloader: searchParams.has("showPreloader")
      ? searchParams.get("showPreloader") === "true"
      : (activeCustom.showPreloader ?? defaultData.showPreloader ?? false),
    preloaderTime: parseFloat(
      searchParams.get("preloaderTime") || String(activeCustom.preloaderTime ?? defaultData.preloaderTime ?? 0.7)
    ),
    groomName: searchParams.get("groomName") || activeCustom.groomName || defaultData.groomName,
    connector: searchParams.get("connector") || activeCustom.connector || defaultData.connector,
    brideName: searchParams.get("brideName") || activeCustom.brideName || defaultData.brideName,
    welcomeTop: searchParams.get("welcomeTop") || activeCustom.welcomeTop || defaultData.welcomeTop,
    andText: searchParams.get("andText") || activeCustom.andText || defaultData.andText,
    inviteText1: searchParams.get("inviteText1") || activeCustom.inviteText1 || defaultData.inviteText1,
    inviteText2: searchParams.get("inviteText2") || activeCustom.inviteText2 || defaultData.inviteText2,
    month: searchParams.get("month") || activeCustom.month || defaultData.month,
    dateDetails: searchParams.get("dateDetails") || activeCustom.dateDetails || defaultData.dateDetails,
    time: searchParams.get("time") || activeCustom.time || defaultData.time,
    locationLine1: searchParams.get("locationLine1") || activeCustom.locationLine1 || defaultData.locationLine1,
    locationLine2: searchParams.get("locationLine2") || activeCustom.locationLine2 || defaultData.locationLine2,
    mapEmbedUrl: searchParams.get("mapEmbedUrl") || activeCustom.mapEmbedUrl || defaultData.mapEmbedUrl,
    storyText: searchParams.get("storyText") || activeCustom.storyText || defaultData.storyText,
    whatsappNumber: searchParams.get("whatsappNumber") || activeCustom.whatsappNumber || defaultData.whatsappNumber,
    audioSrc: searchParams.get("audioSrc") || activeCustom.audioSrc || defaultData.audioSrc,
    events: parsedEvents || (activeCustom.events && activeCustom.events.length > 0 ? activeCustom.events : defaultData.events),
  };

  const Renderer = getTemplateRenderer(templateSlug);

  if (!Renderer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-neutral-400 p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Template Not Found</h2>
        <p className="text-sm">The requested template layout does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <WatermarkOverlay />
      <Renderer inviteData={inviteData} />
    </>
  );
}

export default function InvitationPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-gold-medium p-6">
          <div className="w-8 h-8 border-2 border-gold-medium border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest font-medium">Loading Live Preview...</p>
        </div>
      }
    >
      <InvitationPreviewContent />
    </Suspense>
  );
}
