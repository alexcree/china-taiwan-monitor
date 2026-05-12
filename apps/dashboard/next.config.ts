import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Workspace packages are imported as TS source; let Next transpile them.
  transpilePackages: ["@ctm/brief-schema", "@ctm/shared"],
};

export default config;
