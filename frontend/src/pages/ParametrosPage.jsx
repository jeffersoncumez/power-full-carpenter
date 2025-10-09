// /frontend/src/pages/ParametrosPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatalogoInsumos from "../components/parametros/CatalogoInsumos";
import TiposTareas from "../components/parametros/TiposTareas";
import NivelesStock from "../components/parametros/NivelesStock";
import RolesPermisos from "../components/parametros/RolesPermisos";
// 🆕 Nuevos imports agregados:
import MotivosConsumo from "../components/parametros/MotivosConsumo";
import Prioridades from "../components/parametros/Prioridades";

export default function ParametrosPage() {
  const [activeTab, setActiveTab] = useState("insumos");
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* 🔹 Encabezado */}
      <div className="flex flex-col items-center relative mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute left-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Ir al Dashboard
        </button>

        <h1 className="text-4xl font-extrabold text-gray-800">
          Parámetros del Sistema
        </h1>
        <p className="text-gray-500 mt-2">
          Administra insumos, tareas, stock mínimo y roles de usuario
        </p>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: "insumos", label: "Catálogo de Insumos" },
          { id: "tareas", label: "Tipos de Tareas / Estados" },
          { id: "stock", label: "Niveles de Stock Mínimo" },
          { id: "roles", label: "Roles y Permisos" },
          // 🆕 Nuevas pestañas agregadas:
          { id: "motivos", label: "Motivos de Consumo" },
          { id: "prioridades", label: "Prioridades" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 font-medium -mb-px transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido dinámico */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        {activeTab === "insumos" && <CatalogoInsumos />}
        {activeTab === "tareas" && <TiposTareas />}
        {activeTab === "stock" && <NivelesStock />}
        {activeTab === "roles" && <RolesPermisos />}
        {/* 🆕 Contenido dinámico agregado: */}
        {activeTab === "motivos" && <MotivosConsumo />}
        {activeTab === "prioridades" && <Prioridades />}
      </div>
    </div>
  );
}