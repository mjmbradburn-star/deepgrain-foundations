import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import { componentTagger } from "lovable-tagger";
import { deepgrainSeoPlugin } from "./vite-plugins/deepgrain-seo";
import { intelligenceManifestPlugin } from "./vite-plugins/intelligence-manifest";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    { enforce: "pre" as const, ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: "@mdx-js/react" }) },
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
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react/jsx-runtime", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query", "@tanstack/query-core"],
          "motion-vendor": ["framer-motion"],
        },
      },
    },
  },
}));
