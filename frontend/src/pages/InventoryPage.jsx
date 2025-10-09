// /frontend/src/pages/InventoryPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { getInsumos, getIncidencias, getAlertas } from "../api/inventory";
import InventoryList from "../components/inventory/InventoryList";
import MovementForm from "../components/inventory/MovementForm";
import KardexTable from "../components/inventory/KardexTable";
import IncidenciasList from "../components/inventory/IncidenciasList";

// 🔹 Tabla de Alertas de Stock Bajo
const AlertasTable = ({ alertas }) => (
  <div className="mb-8 bg-white rounded-xl shadow p-4 border border-red-200">
    <h2 className="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
      ⚠️ Alertas de Stock Bajo
    </h2>
    <table className="w-full border text-sm">
      <thead className="bg-red-100 text-red-800">
        <tr>
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">Unidad</th>
          <th className="p-2 border">Stock</th>
          <th className="p-2 border">Stock Mínimo</th>
        </tr>
      </thead>
      <tbody>
        {alertas.map((a) => (
          <tr key={a.insumo_id} className="bg-red-50 hover:bg-red-100">
            <td className="p-2 border font-semibold">{a.nombre}</td>
            <td className="p-2 border">{a.unidad_medida}</td>
            <td className="p-2 border text-red-600 font-bold">{a.stock}</td>
            <td className="p-2 border">{a.stock_minimo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function InventoryPage() {
  const [insumos, setInsumos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [showKardex, setShowKardex] = useState(false);
  const [showIncidencias, setShowIncidencias] = useState(false);
  const [refreshInventory, setRefreshInventory] = useState(0);
  const [refreshKardex, setRefreshKardex] = useState(0);

  const navigate = useNavigate();
  const { user } = useAppContext();

  const fetchData = async () => {
    try {
      const [insumosData, incsData, alertasData] = await Promise.all([
        getInsumos(),
        getIncidencias(),
        getAlertas(),
      ]);
      setInsumos(insumosData);
      setIncidencias(incsData);
      setAlertas(alertasData);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshInventory]);

  return (
    <div className="p-6 space-y-8">
      {/* 🔹 Encabezado */}
      <div className="flex flex-col items-center relative">
        {user?.role?.toLowerCase() === "supervisor" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute left-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Ir al Dashboard
          </button>
        )}

        <h1 className="text-4xl font-extrabold text-gray-800">
          Gestión de Inventario
        </h1>
        <p className="text-gray-500 mt-2">
          Control de insumos, movimientos y reportes de stock
        </p>
      </div>

      {/* 🔹 Alertas */}
      {alertas.length > 0 && <AlertasTable alertas={alertas} />}

      {/* 🔹 Inventario */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
     
        <InventoryList insumos={insumos} />
      </div>

      {/* 🔹 Formulario de movimientos */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <MovementForm
          onSuccess={() => {
            setRefreshInventory((r) => r + 1);
            setRefreshKardex((r) => r + 1);
          }}
        />
      </div>

      {/* 🔹 Botones extra */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowKardex(!showKardex)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {showKardex ? "Ocultar Kardex" : "📊 Ver Kardex"}
        </button>
        {/*
        <button
          onClick={() => setShowIncidencias(!showIncidencias)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {showIncidencias ? "Ocultar Incidencias" : "⚠️ Ver Incidencias"}
        </button>  */}
      </div>   

      {/* 🔹 Kardex */}
      {showKardex && (
        <div className="mt-6 bg-white rounded-xl shadow p-4 border border-gray-200">
          <KardexTable refresh={refreshKardex} />
        </div>
      )}

      {/* 🔹 Incidencias */}
      {showIncidencias && (
        <div className="mt-6 bg-white rounded-xl shadow p-4 border border-gray-200">
          <IncidenciasList />
        </div>
      )}
    </div>
  );
}
