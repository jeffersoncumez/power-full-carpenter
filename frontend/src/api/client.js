import axios from "axios";

// 🌐 Backend desplegado en Render
const client = axios.create({
  baseURL: "https://power-full-carpenter.onrender.com/api",
});

// 🧩 Interceptor para incluir el token si existe
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
