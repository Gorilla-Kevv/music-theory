import { existsSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
// 电子书只在本地存在；GitHub Pages 构建一律隐藏深链（CI 也会移除目录）。
const hasEmbeddedBooks = !isGitHubPages && existsSync("public/books");

export default defineConfig({
  base: isGitHubPages ? "/music-theory/" : "/",
  define: {
    __EMBEDDED_BOOKS__: JSON.stringify(hasEmbeddedBooks),
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          vexflow: ["vexflow"],
          search: ["minisearch"],
        },
      },
    },
  },
});
