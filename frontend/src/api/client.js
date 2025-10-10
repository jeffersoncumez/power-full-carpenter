import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://power-full-carpenter.onrender.com/api";
if (typeof window !== "undefined") {
  // Te permitirá confirmar en consola qué URL quedó en el bundle.
  console.log("[API baseURL]", baseURL);
}

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
