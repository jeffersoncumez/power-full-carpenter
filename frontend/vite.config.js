import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración óptima para producción en Vercel (SPA React Router)
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 importante: rutas relativas (previene 404 en Vercel)
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
