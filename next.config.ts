import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old settings URLs → new page-specific URLs
      { source: "/admin/settings/home", destination: "/admin/pages/home", permanent: true },
      { source: "/admin/settings/work", destination: "/admin/pages/work", permanent: true },
      { source: "/admin/settings/contact", destination: "/admin/pages/contact", permanent: true },
      { source: "/admin/settings", destination: "/admin/pages/home", permanent: true },
      // SEO merged into per-page sections
      { source: "/admin/seo", destination: "/admin/pages/home", permanent: true },
      // Portfolio merged into case-studies with category filter
      { source: "/admin/portfolio", destination: "/admin/pages/case-studies", permanent: true },
      // Moved under /admin/pages/ for consistency
      { source: "/admin/services", destination: "/admin/pages/services", permanent: true },
      { source: "/admin/case-studies", destination: "/admin/pages/case-studies", permanent: true },
    ];
  },
};

export default nextConfig;
