import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@commercetools/nimbus", "@commercetools/nimbus-icons"],
};

export default nextConfig;
