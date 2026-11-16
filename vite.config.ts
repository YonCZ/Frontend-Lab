import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const page = (name: string) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [".trycloudflare.com"],
    proxy: {
      "/api": `http://localhost:${process.env.PORT || 4173}`,
      "/projects": `http://localhost:${process.env.PORT || 4173}`,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: page("index.html"),
        iterator: page("iterator.html"),
        previews: page("previews.html"),
      },
    },
  },
});
