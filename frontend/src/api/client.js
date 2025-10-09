import axios from "axios";

// 🚀 LEE LA URL BASE DESDE LA VARIABLE DE ENTORNO.
//
// En desarrollo (local): lee VITE_API_URL del archivo .env.development (ej. http://localhost:4000/api).
// En producción (Vercel): lee VITE_API_URL de la variable de entorno que configuraste en el panel de Vercel (https://power-full-carpenter.onrender.com/api).
const baseURL = import.meta.env.VITE_API_URL; 

// 🌐 Crea la instancia de Axios usando la URL determinada por el entorno.
const client = axios.create({
  baseURL,
});

// 🧩 Interceptor para incluir el token JWT en las cabeceras de autorización
client.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  
  if (auth) {
    // El objeto 'auth' contiene el token
    const { token } = JSON.parse(auth); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default client;