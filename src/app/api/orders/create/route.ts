/**
 * POST /api/orders/create
 *
 * Creates a Razorpay order and a corresponding pending row in public.orders.
 *
 * Security:
 *   - RAZORPAY_KEY_SECRET never leaves this file.
 *   - Amount is determined server-side from the template catalog.
 *   - Client only sends project_id — it cannot influence the charge amount.
 *   - Requires an authenticated Supabase session (cookie-based).
 *
 * Request body: { project_id: string }
 *
 * Response: { order_id, razorpay_order_id, amount, currency }
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";
import { TEMPLATES } from "@/data/templates";

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error(
    "[/api/orders/create] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment."
  );
}

// ---------------------------------------------------------------------------
// Razorpay client (server-only, singleton)
// ---------------------------------------------------------------------------

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Authenticate the caller
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in before purchasing." },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const { project_id } = body as { project_id?: string };

    if (!project_id) {
      return NextResponse.json(
        { error: "project_id is required." },
        { status: 400 }
      );
    }

    // 3. Load the project — confirms ownership via RLS
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, user_id, template_slug, status")
      .eq("id", project_id)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or access denied." },
        { status: 404 }
      );
    }

    // 4. Guard: prevent paying for an already-paid project
    if (project.status === "paid") {
      return NextResponse.json(
        { error: "This project has already been paid for." },
        { status: 409 }
      );
    }

    // 5. Determine price from server-side template catalog (client cannot influence this)
    const template = TEMPLATES.find((t) => t.slug === project.template_slug);

    if (!template) {
      return NextResponse.json(
        { error: `Unknown template: ${project.template_slug}` },
        { status: 400 }
      );
    }

    // Razorpay expects amount in smallest currency unit (paise for INR)
    const amountInPaise = template.price * 100;

    // 6. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `varnam_${project_id.slice(0, 8)}`,
      notes: {
        project_id: project_id,
        user_id: user.id,
        template: project.template_slug,
      },
    });

    // 7. Insert pending order row in database (amount snapshot at purchase time)
    const { data: dbOrder, error: insertError } = await supabase
      .from("orders")
      .insert({
        project_id: project_id,
        user_id: user.id,
        amount: amountInPaise,
        currency: "INR",
        status: "pending",
        razorpay_order_id: razorpayOrder.id,
      })
      .select("id")
      .single();

    if (insertError || !dbOrder) {
      console.error("[/api/orders/create] DB insert failed:", insertError);
      return NextResponse.json(
        { error: "Failed to create order record. Please try again." },
        { status: 500 }
      );
    }

    // 8. Return safe response (secret never sent to client)
    return NextResponse.json({
      order_id: dbOrder.id,
      razorpay_order_id: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
    });
  } catch (err) {
    console.error("[/api/orders/create] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
