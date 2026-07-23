/**
 * EmailService.ts
 *
 * Transactional email service for Varnam Invites.
 * Automatically sends published wedding website links to users upon successful payment.
 */

export interface SendInvitationEmailParams {
  toEmail: string;
  groomName?: string;
  brideName?: string;
  invitationUrl: string;
  orderId: string;
}

export class EmailService {
  /**
   * Sends the live published invitation link to the user's email.
   */
  static async sendInvitationLiveEmail(params: SendInvitationEmailParams): Promise<boolean> {
    const { toEmail, groomName, brideName, invitationUrl, orderId } = params;

    const coupleText = groomName && brideName ? `${groomName} & ${brideName}` : "Couples";
    const subject = `🎉 Your Wedding Website is Live! | ${coupleText}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f2; color: #121212; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid rgba(212, 175, 55, 0.2); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .header { background: #121212; padding: 32px; text-align: center; color: #fdfbf7; }
          .header h1 { font-family: Georgia, serif; font-size: 24px; margin: 0; color: #d4af37; letter-spacing: 2px; }
          .content { padding: 40px 32px; line-height: 1.6; }
          .couple-heading { font-family: Georgia, serif; font-size: 22px; color: #834701; text-align: center; margin-bottom: 24px; }
          .link-box { background: #fdfbf7; border: 1px border #e5d9c5; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; }
          .button { display: inline-block; background: #834701; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; transition: background 0.3s ease; }
          .url-text { margin-top: 14px; font-size: 12px; color: #7a6e5d; word-break: break-all; }
          .footer { background: #fcf9f2; padding: 24px 32px; text-align: center; font-size: 12px; color: #7a6e5d; border-top: 1px solid rgba(212, 175, 55, 0.1); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VARNAM INVITES</h1>
          </div>
          <div class="content">
            <h2 class="couple-heading">${coupleText}'s Wedding Website</h2>
            <p>Congratulations! Your digital wedding invitation website is officially published and live on the web.</p>
            <p>You can now share this website link directly with your family and guests via WhatsApp, Instagram, or Email.</p>

            <div class="link-box">
              <a href="${invitationUrl}" target="_blank" class="button">View Live Website</a>
              <div class="url-text">${invitationUrl}</div>
            </div>

            <p style="font-size: 13px; color: #666;">Order ID: <strong>${orderId}</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Varnam Invites. All rights reserved.</p>
            <p>Need help or updates? Reply to this email or contact support@varnaminvites.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Check if Resend API Key is set in environment
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
            from: "Varnam Invites <invites@varnaminvites.com>",
            to: [toEmail],
            subject: subject,
            html: htmlContent,
          }),
        });

        if (response.ok) {
          console.log(`[EmailService] Live invitation email sent successfully to ${toEmail}`);
          return true;
        } else {
          const errData = await response.json();
          console.error("[EmailService] Resend API error:", errData);
        }
      } catch (err) {
        console.error("[EmailService] Failed to send email via Resend:", err);
      }
    }

    // Fallback log output for development or missing API key
    console.log("------------------------------------------------------------");
    console.log(`[EmailService] LIVE INVITATION EMAIL TO: ${toEmail}`);
    console.log(`[EmailService] SUBJECT: ${subject}`);
    console.log(`[EmailService] LINK: ${invitationUrl}`);
    console.log("------------------------------------------------------------");

    return true;
  }
}
