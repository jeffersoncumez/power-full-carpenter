import axios from "axios";

// Detecta automáticamente si estás en desarrollo o producción
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api" // 🖥️ cuando trabajas localmente
    : "https://power-full-carpenter-backend.onrender.com/api"; // 🌐 cambia por tu URL de Render

const client = axios.create({
  baseURL,
});

// Interceptor para agregar token en headers
client.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default client;
