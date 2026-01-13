import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["tagandtake-media-dev.s3.amazonaws.com"],
  },
  allowedDevOrigins: ["192.168.0.70"],
};

export default nextConfig;
