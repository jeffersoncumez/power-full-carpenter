import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const client = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor para agregar token en headers
client.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default client;
