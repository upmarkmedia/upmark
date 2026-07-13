import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin/settings/home", destination: "/admin/pages/home", permanent: true },
      { source: "/admin/settings/work", destination: "/admin/pages/work", permanent: true },
      { source: "/admin/settings/contact", destination: "/admin/pages/contact", permanent: true },
      { source: "/admin/settings", destination: "/admin/pages/home", permanent: true },
      { source: "/admin/seo", destination: "/admin/pages/home", permanent: true },
      { source: "/admin/portfolio", destination: "/admin/pages/case-studies", permanent: true },
      { source: "/admin/services", destination: "/admin/pages/services", permanent: true },
      { source: "/admin/case-studies", destination: "/admin/pages/case-studies", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://pub-a71a6003788f4fc991bb79126b750fc0.r2.dev https://upmark.co",
              "media-src 'self' https://pub-a71a6003788f4fc991bb79126b750fc0.r2.dev",
              "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.r2.cloudflarestorage.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "pub-a71a6003788f4fc991bb79126b750fc0.r2.dev",
      },
    ],
  },
};

export default nextConfig;
