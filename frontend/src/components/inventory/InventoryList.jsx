import React from 'react';

// El componente ahora recibe los insumos como props
export default function InventoryList({ insumos }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* 🔹 Título */}
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight flex items-center">
        📦 Inventario de Insumos
      </h2>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-gray-700 font-semibold">Nombre</th>
              <th className="p-3 text-gray-700 font-semibold">Unidad</th>
              <th className="p-3 text-gray-700 font-semibold">Stock</th>
              <th className="p-3 text-gray-700 font-semibold">Stock mínimo</th>
            </tr>
          </thead>
          <tbody>
            {insumos.length > 0 ? (
              insumos.map((i, idx) => (
                <tr
                  key={i.insumo_id}
                  className={`hover:bg-gray-50 transition ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">{i.nombre}</td>
                  <td className="p-3 text-gray-700">{i.unidad_medida}</td>
                  <td
                    className={`p-3 font-semibold ${
                      parseFloat(i.stock) <= parseFloat(i.stock_minimo)
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {i.stock}
                  </td>
                  <td className="p-3 text-gray-700">{i.stock_minimo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No hay insumos registrados en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}