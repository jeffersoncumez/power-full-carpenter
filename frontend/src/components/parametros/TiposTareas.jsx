import { useEffect, useState } from "react";
import {
  getParametros,
  addParametro,
  deleteParametro,
} from "../../api/parametros";

export default function TiposTareas() {
  const [areas, setAreas] = useState([]);
  const [nuevo, setNuevo] = useState("");

  const loadData = async () => {
    const data = await getParametros("area"); // 👈 categoría "area"
    setAreas(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!nuevo.trim()) return;
    await addParametro("area", nuevo.trim());
    setNuevo("");
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta área?")) {
      await deleteParametro(id);
      loadData();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🏭 Áreas de Producción</h3>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-3 py-2 text-left">Área</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a, idx) => (
              <tr
                key={a.parametro_id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="border px-3 py-2">{a.valor}</td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => handleDelete(a.parametro_id)}
                    className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-200 transition"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {areas.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500 italic">
                  No hay áreas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario de agregar */}
      <div className="flex gap-2 mt-5">
        <input
          type="text"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nueva área"
          className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Agregar
        </button>
      </div>
    </div>
  );
}
