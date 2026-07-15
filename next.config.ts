import type { NextConfig } from "next";
import { WORDPRESS_REDIRECTS } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["shivamnexa.surakshitam.com", "*.surakshitam.com"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/service", destination: "/nexa-service-center", permanent: true },
      { source: "/studio", destination: "/studio/desk", permanent: false },
      ...WORDPRESS_REDIRECTS,
    ];
  },
};

export default nextConfig;
