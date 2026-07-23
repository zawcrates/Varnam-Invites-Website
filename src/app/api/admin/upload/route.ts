import { NextRequest, NextResponse } from "next/server";
import { createClient as createBrowserClient } from "@/lib/supabase/browser";
import { requireAdminApi } from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdminApi();
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "template-thumbnails";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validBuckets = ["template-thumbnails", "template-gallery", "template-audio"];
    if (!validBuckets.includes(bucket)) {
      return NextResponse.json({ error: "Invalid storage bucket target" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const supabase = createBrowserClient();
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      const mockUrl = `/templates/preview-${fileName}`;
      return NextResponse.json({ url: mockUrl, warning: error.message }, { status: 200 });
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "File upload failed" },
      { status: 500 }
    );
  }
}
