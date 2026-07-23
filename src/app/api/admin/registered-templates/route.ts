import { NextResponse } from "next/server";
import { getRegisteredSlugs, RegisteredManifests } from "@/templates";
import { TemplateService } from "@/services/TemplateService";
import type { RegisteredTemplateInfo, TemplateManifest } from "@/types";

export async function GET() {
  try {
    const registeredSlugs = getRegisteredSlugs();
    const existingDbTemplates = await TemplateService.getAllAdmin();

    const registeredTemplates: RegisteredTemplateInfo[] = registeredSlugs.map((slug) => {
      const manifest: TemplateManifest = RegisteredManifests[slug] || {
        slug,
        name: slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        category: "Traditional",
        version: 1,
        author: "Varnam Developer",
      };

      const dbMatch = existingDbTemplates.find((t) => t.slug === slug);

      return {
        slug,
        manifest,
        isRegistered: true,
        hasDatabaseRecord: Boolean(dbMatch),
        existingTemplateId: dbMatch?.id,
      };
    });

    return NextResponse.json({
      success: true,
      registeredTemplates,
    });
  } catch (error) {
    console.error("Failed to fetch registered templates:", error);
    return NextResponse.json(
      { error: "Failed to discover registered templates" },
      { status: 500 }
    );
  }
}
