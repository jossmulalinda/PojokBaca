import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.27", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "192.168.1.27" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
