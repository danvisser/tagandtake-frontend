import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["tagandtake-media-dev.s3.amazonaws.com"],
  },
};

export default nextConfig;
