import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import { componentTagger } from "lovable-tagger";
import { deepgrainSeoPlugin } from "./vite-plugins/deepgrain-seo";
import { intelligenceManifestPlugin } from "./vite-plugins/intelligence-manifest";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    {
      enforce: "pre" as const,
      ...mdx({
        remarkPlugins: [remarkGfm],
        providerImportSource: "@mdx-js/react",
        development: command === "serve",
      }),
    },
    react(),
    deepgrainSeoPlugin(),
    intelligenceManifestPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    // Let Rollup handle chunking automatically. Hand-rolled manualChunks
    // produced a circular import between helmet-vendor and react-vendor that
    // caused a TDZ ReferenceError on the published site.
  },
}));
