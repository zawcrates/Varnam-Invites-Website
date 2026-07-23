import { NextRequest, NextResponse } from "next/server";
import { TemplateService } from "@/services/TemplateService";
import { requireAdminApi } from "@/lib/auth/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const template = await TemplateService.getById(id);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch template" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await TemplateService.update(id, body);
    return NextResponse.json({ template: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    await TemplateService.delete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete template" },
      { status: 500 }
    );
  }
}
