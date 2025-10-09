import React from "react";
import { useEffect, useState } from 'react'; 
import { getInsumos } from '../../api/inventory';
import { getProduccion, getEficiencia } from '../../api/reports';

export default function AdminDashboard() {
  const [insumos, setInsumos] = useState([]);
  const [produccion, setProduccion] = useState([]);
  const [eficiencia, setEficiencia] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const ins = await getInsumos();
        setInsumos(ins);
        const prod = await getProduccion();
        setProduccion(prod);
        const ef = await getEficiencia();
        setEficiencia(ef);
      } catch (e) {
        console.error('Error cargando dashboard', e);
      }
    })();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* 🔹 Encabezado */}
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight">
        Dashboard Administrador
      </h1>

      {/* 🔹 Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventario */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            📦 Inventario (stock bajo)
          </h2>
          {insumos.filter((i) => i.stock <= i.stock_minimo).length > 0 ? (
            <ul className="space-y-2 text-gray-600">
              {insumos
                .filter((i) => i.stock <= i.stock_minimo)
                .map((i) => (
                  <li
                    key={i.insumo_id}
                    className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm"
                  >
                    {i.nombre} — <span className="font-semibold">{i.stock}</span>{" "}
                    {i.unidad_medida}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">Todo el stock está en buen nivel ✅</p>
          )}
        </div>

        {/* Producción */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            🏭 Producción terminada
          </h2>
          {produccion.length > 0 ? (
            <ul className="space-y-2 text-gray-600">
              {produccion.map((p) => (
                <li
                  key={p.pedido_id}
                  className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm"
                >
                  Pedido <span className="font-semibold">{p.pedido_id}</span> — Cliente:{" "}
                  {p.nombre_cliente}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No hay producción registrada</p>
          )}
        </div>
      </div>

      {/* 🔹 Eficiencia */}
      {eficiencia && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            📊 Eficiencia
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-center">
              <p className="text-sm text-gray-600">Pedidos completados</p>
              <p className="text-lg font-bold text-green-700">
                {eficiencia.pedidos_completados} / {eficiencia.total_pedidos}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-center">
              <p className="text-sm text-gray-600">Tareas completadas</p>
              <p className="text-lg font-bold text-yellow-700">
                {eficiencia.tareas_completadas} / {eficiencia.total_tareas}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
