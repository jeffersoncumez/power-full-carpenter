import axios from "axios";

// 🌍 Lee la URL base desde las variables de entorno
const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://power-full-carpenter.onrender.com/api"; // fallback

console.log("🛰️ API baseURL:", baseURL);

const client = axios.create({ baseURL });

// 🔐 Interceptor para incluir token JWT
client.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
