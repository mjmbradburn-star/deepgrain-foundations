import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { intelligenceManifest } from "./vite-plugins/intelligence-manifest";

export default defineConfig({
  // intelligenceManifest resolves the `virtual:intelligence-manifest` import
  // used by src/lib/intelligence.ts — without it, any test that imports from
  // there (e.g. the FAQ JSON-LD validator) fails to resolve the virtual module.
  plugins: [react(), intelligenceManifest()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
