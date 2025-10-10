import axios from "axios";

// ✅ Usa variable de entorno Vercel o fallback
const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://power-full-carpenter.onrender.com/api";

console.log("🛰️ API baseURL:", baseURL);

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Agregar token JWT si existe
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
