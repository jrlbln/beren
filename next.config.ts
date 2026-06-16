import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
