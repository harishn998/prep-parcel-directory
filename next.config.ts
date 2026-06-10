import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
        // NOTE: no `search` key — public URLs carry a ?v=<timestamp> cache
        // buster, and setting search:"" would reject any query string.
      },
    ],
  },
  experimental: {
    // Cover images are accepted up to 5 MB; the Server Action default body
    // limit is 1 MB, which would reject them before our own validation runs.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
