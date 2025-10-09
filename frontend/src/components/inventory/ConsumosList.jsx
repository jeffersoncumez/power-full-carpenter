// /frontend/src/components/inventory/ConsumosList.jsx
import { useEffect, useState } from 'react';
import { getConsumos } from '../../api/inventory';

export default function ConsumosList() {
  const [consumos, setConsumos] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getConsumos();
      setConsumos(data);
    } catch (err) {
      console.error('Error cargando consumos', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* 🔹 Encabezado */}
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight flex items-center">
        📑 Consumos reportados
      </h2>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-gray-700 font-semibold">Fecha</th>
              <th className="p-3 text-gray-700 font-semibold">Insumo</th>
              <th className="p-3 text-gray-700 font-semibold">Cantidad</th>
              <th className="p-3 text-gray-700 font-semibold">Unidad</th>
              <th className="p-3 text-gray-700 font-semibold">Responsable</th>
              <th className="p-3 text-gray-700 font-semibold">Tarea</th>
            </tr>
          </thead>
          <tbody>
            {consumos.length > 0 ? (
              consumos.map((c, idx) => (
                <tr
                  key={c.movimiento_id}
                  className={`hover:bg-gray-50 transition ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  <td className="p-3 text-gray-600">
                    {new Date(c.fecha_movimiento).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{c.nombre}</td>
                  <td className="p-3 text-gray-700">{c.cantidad}</td>
                  <td className="p-3 text-gray-700">{c.unidad_medida}</td>
                  <td className="p-3 text-gray-700">{c.responsable}</td>
                  <td className="p-3 text-blue-600 font-semibold">#{c.tarea_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 italic">
                  No se han registrado consumos todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
