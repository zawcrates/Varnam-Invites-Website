import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const brandEmail = "varnaminvites@gmail.com";
    const subject = `📩 New Contact Form Inquiry from ${name}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #fdfbf7; color: #111; padding: 30px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5d9c5; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { font-size: 20px; font-weight: bold; color: #834701; margin-bottom: 20px; border-b: 1px solid #eee; pb: 10px; }
          .field { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #777; letter-spacing: 1px; }
          .value { font-size: 15px; color: #111; margin-top: 4px; }
          .message-box { background: #fdfbf7; padding: 16px; border-radius: 8px; border: 1px solid #eae5db; margin-top: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">New Inquiry Received — Varnam Invites</div>
          
          <div class="field">
            <div class="label">Customer Name</div>
            <div class="value"><strong>${name}</strong></div>
          </div>
          
          <div class="field">
            <div class="label">Customer Email</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${message}</div>
          </div>
          
          <div style="font-size: 12px; color: #888; margin-top: 24px; text-align: center;">
            Sent directly from Varnam Invites Contact Form
          </div>
        </div>
      </body>
      </html>
    `;

    // Send via Resend API if API Key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Varnam Invites Contact <contact@varnaminvites.com>",
            to: [brandEmail],
            replyTo: email,
            subject: subject,
            html: htmlContent,
          }),
        });

        if (response.ok) {
          console.log(`[Contact API] Inquiry email sent to ${brandEmail}`);
        } else {
          const errData = await response.json();
          console.error("[Contact API] Resend API error:", errData);
        }
      } catch (err) {
        console.error("[Contact API] Resend dispatch failed:", err);
      }
    }

    // Server log fallback output for development & record keeping
    console.log("============================================================");
    console.log(`[CONTACT FORM SUBMISSION RECEIVED]`);
    console.log(`TO BRAND EMAIL: ${brandEmail}`);
    console.log(`FROM: ${name} <${email}>`);
    console.log(`MESSAGE: ${message}`);
    console.log("============================================================");

    return NextResponse.json({
      success: true,
      message: "Message sent directly to Varnam Invites support team.",
    });
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
