import type { NextConfig } from "next";

// Two build modes:
//   - default `next build`: normal server build for local dev / node hosting
//   - `STATIC_EXPORT=1`: static HTML export mounted at moonland.cc/lifestory
//     (see scripts/export-static.sh). The chat API route can't be exported,
//     so the script stashes app/api and the Pages Function in moonland-site
//     serves /lifestory/api/chat instead.
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? "/lifestory" : "";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export",
        basePath,
        // Cloudflare Pages has no image optimizer; serve originals with basePath.
        images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
      }
    : {}),
  turbopack: { root: __dirname },
  env: {
    // Read by lib/basePath.ts so plain <img>/fetch paths get the prefix too.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
