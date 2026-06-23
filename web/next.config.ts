import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.join(__dirname, "..");

const nextConfig: NextConfig = {
  transpilePackages: ["@famelii/core"],
  // Produção / tracing no monorepo (dev usa webpack — ver script "dev").
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
