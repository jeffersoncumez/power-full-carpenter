import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://power-full-carpenter.onrender.com/api";

console.log("🛰️ API baseURL:", baseURL);

const client = axios.create({ baseURL });

// 🔐 Incluir token JWT en cada request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
