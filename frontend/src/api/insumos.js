// src/api/insumos.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/insumos";

// 🔹 Obtener todos los insumos
export async function getInsumos() {
  const res = await axios.get(API_URL);
  return res.data;
}

// 🔹 Obtener un insumo por ID
export async function getInsumoById(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

// 🔹 Crear un nuevo insumo
export async function addInsumo(data) {
  const res = await axios.post(API_URL, data);
  return res.data;
}

// 🔹 Actualizar un insumo
export async function updateInsumo(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
}

// 🔹 Eliminar un insumo
export async function deleteInsumo(id) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}


export async function getNivelesStock() {
  const res = await axios.get(`${API_URL}/niveles`);
  return res.data;
}
