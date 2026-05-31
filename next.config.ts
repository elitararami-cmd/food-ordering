import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/products/**' },
      { pathname: '/food/**' },
    ],
  },
};

export default nextConfig;
