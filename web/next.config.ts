import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.join(__dirname, "..");

const nextConfig: NextConfig = {
  transpilePackages: ["@famelii/core"],
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
