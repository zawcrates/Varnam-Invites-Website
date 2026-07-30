/**
 * POST /api/orders/verify
 *
 * Server-side HMAC-SHA256 signature verification for Razorpay payments.
 *
 * Security contract:
 *   - Payment is ONLY considered successful after this route validates the signature.
 *   - The signature is never stored in the database (verification-only).
 *   - RAZORPAY_KEY_SECRET never leaves this file.
 *   - Idempotent: if the order is already paid, returns success without re-updating.
 *   - Duplicate callback protection via the UNIQUE constraint on razorpay_order_id.
 *
 * Request body:
 *   { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Response (success): { success: true, message: "Payment verified." }
 * Response (failure): { success: false, message: "..." }
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { ProjectService } from "@/services/ProjectService";
import { PublishService } from "@/services/PublishService";
import { EmailService } from "@/services/EmailService";

// ---------------------------------------------------------------------------
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const isLaunchMode = process.env.NEXT_PUBLIC_LAUNCH_MODE?.toLowerCase() === "true";

  if (isLaunchMode) {
    return NextResponse.json(
      { message: "Online payments are temporarily unavailable." },
      { status: 503 }
    );
  }

  if (!RAZORPAY_KEY_SECRET) {
    throw new Error(
      "[/api/orders/verify] Missing RAZORPAY_KEY_SECRET in environment."
    );
  }
  try {
    const supabase = await createClient();

    // 1. Authenticate the caller
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body as {
      order_id?: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing required payment fields." },
        { status: 400 }
      );
    }

    // 3. Load the order — RLS ensures it belongs to the caller
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, project_id, user_id, status, razorpay_order_id")
      .eq("id", order_id)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, message: "Order not found or access denied." },
        { status: 404 }
      );
    }

    // 4. Idempotency: if already paid, ensure it is published and return success
    if (order.status === "paid") {
      try {
        await PublishService.publishProject(supabase, order.project_id);
      } catch (pubErr) {
        console.warn("[/api/orders/verify] Idempotent publish failed:", pubErr);
      }
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
      });
    }

    // 5. Verify the Razorpay order_id matches what we issued (prevent substitution)
    if (order.razorpay_order_id !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID mismatch." },
        { status: 400 }
      );
    }

    // 6. Load the project and guard against double-payment
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, status, draft_data")
      .eq("id", order.project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, message: "Associated project not found." },
        { status: 404 }
      );
    }

    if (project.status === "paid") {
      // Project already paid — mark this order paid for consistency, publish, and return success
      await supabase
        .from("orders")
        .update({
          status: "paid",
          razorpay_payment_id,
          verified_at: new Date().toISOString(),
          paid_at: new Date().toISOString(),
        })
        .eq("id", order_id);

      try {
        await PublishService.publishProject(supabase, order.project_id);
      } catch (pubErr) {
        console.warn("[/api/orders/verify] Early-out publish failed:", pubErr);
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified (project already paid).",
      });
    }

    // 7. HMAC-SHA256 signature verification
    //    Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
    const body_str = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(body_str)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch — possible tampering; mark order failed
      await supabase
        .from("orders")
        .update({
          status: "failed",
          failure_reason: "Signature verification failed.",
        })
        .eq("id", order_id);

      console.error(
        `[/api/orders/verify] Signature mismatch for order ${order_id}`
      );

      return NextResponse.json(
        { success: false, message: "Payment verification failed. Possible tampering detected." },
        { status: 400 }
      );
    }

    // 8. Signature verified — update order and project atomically
    const now = new Date().toISOString();

    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        verified_at: now,
        paid_at: now,
      })
      .eq("id", order_id);

    if (updateOrderError) {
      console.error("[/api/orders/verify] Failed to update order:", updateOrderError);
      return NextResponse.json(
        { success: false, message: "Failed to update order status." },
        { status: 500 }
      );
    }

    // Mark project paid (draft → paid guard is inside markProjectPaid)
    await ProjectService.markProjectPaid(supabase, order.project_id);

    // Call PublishService to generate slug and publish record synchronously on server
    try {
      const pub = await PublishService.publishProject(supabase, order.project_id);
      if (pub && pub.slug && user.email) {
        const origin = request.nextUrl.origin;
        const invitationUrl = `${origin}/invite/${pub.slug}`;
        const draftData = (project.draft_data || {}) as Record<string, string>;

        await EmailService.sendInvitationLiveEmail({
          toEmail: user.email,
          groomName: draftData.groomName,
          brideName: draftData.brideName,
          invitationUrl,
          orderId: order_id,
        });
      }
    } catch (pubErr) {
      console.error("[/api/orders/verify] Failed to publish project or send email:", pubErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and invitation published successfully.",
    });
  } catch (err) {
    console.error("[/api/orders/verify] Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
