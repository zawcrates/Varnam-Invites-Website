"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getTemplateRenderer, getTemplateManifest } from "@/templates";
import { InviteData, TEMPLATES } from "@/data/templates";
import { TemplateService } from "@/services/TemplateService";

function InvitationPreviewContent() {
  const searchParams = useSearchParams();

  // Extract parameters
  const templateSlug = searchParams.get("template") || "kovil-vaibhavam";
  const manifest = getTemplateManifest(templateSlug);
  const staticRecord = TEMPLATES.find((t) => t.slug === templateSlug);

  const [liveDefaultData, setLiveDefaultData] = useState<Partial<InviteData>>(
    manifest?.defaultData || staticRecord?.defaultData || {}
  );

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

  const defaultData = liveDefaultData;

  const eventsParam = searchParams.get("events");
  let parsedEvents = undefined;
  if (eventsParam) {
    try {
      parsedEvents = JSON.parse(eventsParam);
    } catch (e) {
      console.error("Failed to parse events JSON parameter", e);
    }
  }

  // Reconstruct inviteData with fallbacks from live defaultData
  const inviteData: Partial<InviteData> = {
    showPreloader: searchParams.has("showPreloader")
      ? searchParams.get("showPreloader") === "true"
      : defaultData.showPreloader ?? false,
    preloaderTime: parseFloat(
      searchParams.get("preloaderTime") || String(defaultData.preloaderTime ?? 0.7)
    ),
    groomName: searchParams.get("groomName") || defaultData.groomName,
    connector: searchParams.get("connector") || defaultData.connector,
    brideName: searchParams.get("brideName") || defaultData.brideName,
    welcomeTop: searchParams.get("welcomeTop") || defaultData.welcomeTop,
    andText: searchParams.get("andText") || defaultData.andText,
    inviteText1: searchParams.get("inviteText1") || defaultData.inviteText1,
    inviteText2: searchParams.get("inviteText2") || defaultData.inviteText2,
    month: searchParams.get("month") || defaultData.month,
    dateDetails: searchParams.get("dateDetails") || defaultData.dateDetails,
    time: searchParams.get("time") || defaultData.time,
    locationLine1: searchParams.get("locationLine1") || defaultData.locationLine1,
    locationLine2: searchParams.get("locationLine2") || defaultData.locationLine2,
    mapEmbedUrl: searchParams.get("mapEmbedUrl") || defaultData.mapEmbedUrl,
    storyText: searchParams.get("storyText") || defaultData.storyText,
    whatsappNumber: searchParams.get("whatsappNumber") || defaultData.whatsappNumber,
    audioSrc: searchParams.get("audioSrc") || defaultData.audioSrc,
    events: parsedEvents || defaultData.events,
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

  return <Renderer inviteData={inviteData} />;
}

export default function InvitationPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#fdfbf7] text-[#834701] font-serif text-lg tracking-widest">
          Loading Preview...
        </div>
      }
    >
      <InvitationPreviewContent />
    </Suspense>
  );
}
