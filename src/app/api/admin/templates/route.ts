import { NextRequest, NextResponse } from "next/server";
import { TemplateService } from "@/services/TemplateService";
import { requireAdminApi } from "@/lib/auth/admin";
import type { TemplateVisibility } from "@/types";

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const visibility = searchParams.get("visibility");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let templates = await TemplateService.getAllAdmin();

    if (visibility && visibility !== "all") {
      templates = templates.filter((t) => t.visibility === visibility);
    }

    if (category && category !== "all") {
      templates = templates.filter((t) => t.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      templates = templates.filter(
        (t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Name and Slug are required fields" },
        { status: 400 }
      );
    }

    const created = await TemplateService.create(body);
    return NextResponse.json({ template: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create template" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { action, ids, visibility } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No template IDs provided" },
        { status: 400 }
      );
    }

    if (action === "bulk-visibility" && visibility) {
      await TemplateService.bulkUpdateVisibility(ids, visibility as TemplateVisibility);
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === "bulk-delete") {
      for (const id of ids) {
        await TemplateService.delete(id);
      }
      return NextResponse.json({ success: true, count: ids.length });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}
