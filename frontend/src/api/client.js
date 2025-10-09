import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api"
    : "https://power-full-carpenter.onrender.com/api";

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
