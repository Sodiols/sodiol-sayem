import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const development = process.env.NODE_ENV !== "production";
    // Static rendering requires Next's inline bootstrap. This allowlist is not
    // a nonce-based XSS defence; it restricts third parties without forcing SSR.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' ${development ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://hcaptcha.com https://*.hcaptcha.com`,
      "style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com",
      "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://hcaptcha.com https://*.hcaptcha.com",
      `connect-src 'self' ${development ? "ws: wss:" : ""} https://api.web3forms.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://hcaptcha.com https://*.hcaptcha.com`,
      "font-src 'self' data:", "frame-src https://hcaptcha.com https://*.hcaptcha.com",
      "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'",
      "form-action 'self' https://api.web3forms.com",
    ].join("; ");
    return [{ source:"/:path*", headers:[
      {key:"Content-Security-Policy",value:csp},
      {key:"X-Content-Type-Options",value:"nosniff"},
      {key:"X-Frame-Options",value:"DENY"},
      {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
      {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()"},
    ] }];
  },
  async redirects() {
    return [{ source: "/about", destination: "/#about", permanent: true }];
  },
};

export default nextConfig;
