import { defineConfig } from "vitest/config";

// Konfigurasi kecil untuk dev, build, dan test.
// - base relatif agar hasil build bisa ditaruh di mana saja (mis. GitHub Pages)
// - Lightning CSS agar @layer, CSS nesting, dan container queries diproses benar
// - Vitest memakai jsdom supaya lapisan DOM bisa diuji langsung
export default defineConfig({
  base: "./",
  css: {
    transformer: "lightningcss",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    cssMinify: "lightningcss",
  },
  server: {
    open: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});