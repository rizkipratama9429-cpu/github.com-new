import { defineConfig } from "vite";

// Konfigurasi kecil: base relatif agar hasil build bisa ditaruh di mana saja
// (mis. GitHub Pages), output dibersihkan tiap build, dan Lightning CSS dipakai
// agar @layer, CSS nesting, serta container queries diproses dengan benar.
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
});