import { useEffect, useState } from "react";
import { getParametros, addParametro, updateParametro, deleteParametro } from "../../api/parametros";

export default function MotivosConsumo() {
  const [motivos, setMotivos] = useState([]);
  const [nuevo, setNuevo] = useState("");

  const loadData = async () => {
    const data = await getParametros("motivos_consumo");
    setMotivos(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!nuevo.trim()) return;
    await addParametro("motivos_consumo", nuevo.trim());
    setNuevo("");
    loadData();
  };

  const handleEdit = async (id, valorActual) => {
    const nuevoValor = prompt("Editar motivo:", valorActual);
    if (nuevoValor && nuevoValor.trim()) {
      await updateParametro(id, nuevoValor.trim(), "motivos_consumo");
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este motivo?")) {
      await deleteParametro(id, "motivos_consumo");
      loadData();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Motivos de Consumo / Desperdicio</h3>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-3 py-2 text-left">Motivo</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {motivos.map((m, idx) => (
              <tr
                key={m.parametro_id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="border px-3 py-2">{m.valor}</td>
                <td className="border px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(m.parametro_id, m.valor)}
                    className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded hover:bg-yellow-200"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(m.parametro_id)}
                    className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-200"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {motivos.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500 italic">
                  No hay motivos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-5">
        <input
          type="text"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nuevo motivo"
          className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Agregar
        </button>
      </div>
    </div>
  );
}
