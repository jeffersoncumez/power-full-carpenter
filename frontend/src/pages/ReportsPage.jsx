// /frontend/src/pages/ReportsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ProduccionReport from "../components/reports/ProduccionReport";
import TiemposReport from "../components/reports/TiemposReport";
import ConsumoReport from "../components/reports/ConsumoReport";
import DesperdicioReport from "../components/reports/DesperdicioReport";
import EficienciaReport from "../components/reports/EficienciaReport";

const TABS = [
  { key: "produccion", title: "Producción", component: ProduccionReport },
  { key: "tiempos", title: "Tiempos", component: TiemposReport },
  { key: "consumo", title: "Consumo", component: ConsumoReport },
  { key: "desperdicio", title: "Desperdicio", component: DesperdicioReport },
  { key: "eficiencia", title: "Eficiencia", component: EficienciaReport },
];

export default function ReportsPage() {
  const [tab, setTab] = useState("produccion");
  const Active = TABS.find((t) => t.key === tab)?.component || ProduccionReport;

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

        <h1 className="text-4xl font-extrabold text-gray-800">Reportes</h1>
        <p className="text-gray-500 mt-2">
          Consulta métricas de producción, tiempos, consumo, desperdicio y eficiencia
        </p>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 font-medium -mb-px transition-colors border-b-2 ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-500"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido dinámico en tarjeta */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <Active />
      </div>
    </div>
  );
}
