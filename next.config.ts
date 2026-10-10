import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the original directory-style URLs (/about/, /projects/tara/) so existing links and rankings carry over.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/projects", destination: "/work/", permanent: true }];
  },
};

export default nextConfig;
