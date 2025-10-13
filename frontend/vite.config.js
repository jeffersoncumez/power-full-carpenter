import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Mostrar en logs de Vercel si la variable está siendo leída
console.log("===========================================");
console.log("🔍 Verificando variable VITE_API_URL:");
console.log("👉 Valor detectado en build:", process.env.VITE_API_URL || "(no detectado)");
console.log("===========================================");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
