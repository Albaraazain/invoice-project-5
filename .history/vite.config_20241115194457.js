import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    cssMinify: "lightningcss",
  },
});
