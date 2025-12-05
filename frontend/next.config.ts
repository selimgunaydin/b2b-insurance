import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-expect-error -- ESLint config not fully typed in NextConfig
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
