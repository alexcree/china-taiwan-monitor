import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Workspace packages are imported as TS source; let Next transpile them.
  transpilePackages: ["@ctm/brief-schema", "@ctm/shared"],
  // The packages use `.js` extensions on internal imports (NodeNext-style)
  // so they remain runnable from Node ESM workers. Tell webpack to resolve
  // `.js` to `.ts`/`.tsx` for monorepo source packages.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default config;
