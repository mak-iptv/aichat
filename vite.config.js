import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    allowedHosts: ["aichat-sc4w.onrender.com"], // 🔥 Shto domenin e Render-it
  },
});
