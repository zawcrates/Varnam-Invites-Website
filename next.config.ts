import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Build environment-aware Content Security Policy dynamically
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://*.supabase.co";
// Extract hostname from Supabase URL for CSP connect-src
let supabaseHost = "*.supabase.co";
try {
  if (supabaseUrl) {
    const url = new URL(supabaseUrl);
    supabaseHost = url.hostname;
  }
} catch (e) {
  // Fallback to wildcard
}

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://api.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: ${supabaseHost} *.supabase.co https://*.razorpay.com https://lh3.googleusercontent.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' ${supabaseHost} *.supabase.co https://api.razorpay.com wss://${supabaseHost} wss://*.supabase.co ${isDev ? "ws://localhost:* http://localhost:*" : ""};
  frame-src 'self' https://api.razorpay.com https://*.razorpay.com;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
