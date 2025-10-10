import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración completa para Vercel y React Router
export default defineConfig({
  plugins: [react()],
  base: "/", // 🔹 Asegura rutas correctas al construir
  build: {
    outDir: "dist", // salida por defecto de Vite
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
