import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { intelligenceManifestPlugin } from "./vite-plugins/intelligence-manifest";

export default defineConfig({
  // intelligenceManifestPlugin resolves the `virtual:intelligence-manifest`
  // import used by src/lib/intelligence.ts — without it, any test that imports
  // from there (e.g. the FAQ JSON-LD validator) fails to resolve the module.
  plugins: [react(), intelligenceManifestPlugin()],
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
