import { useEffect, useState } from "react";
import { getNivelesStock, updateInsumo } from "../../api/insumos";

export default function NivelesStock() {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Modal
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [form, setForm] = useState({ stock_minimo: 0 });

  const loadData = async () => {
    setErr("");
    try {
      const data = await getNivelesStock();
      setNiveles(data);
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || "Error cargando niveles de stock");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (row) => {
    setEditId(row.insumo_id);
    setEditNombre(row.nombre);
    setForm({ stock_minimo: Number(row.stock_minimo ?? 0) });
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEditId(null);
    setEditNombre("");
    setForm({ stock_minimo: 0 });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErr("");

    const value = Number(form.stock_minimo);
    if (Number.isNaN(value) || value < 0) {
      setErr("El stock mínimo debe ser un número mayor o igual a 0.");
      setLoading(false);
      return;
    }

    try {
      await updateInsumo(editId, { stock_minimo: value });
      closeModal();
      await loadData();
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || "No se pudo actualizar el stock mínimo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Niveles de Stock</h3>
      {err && <div className="text-red-600 mb-3 font-medium">{err}</div>}

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-3 py-2 text-left">Insumo</th>
              <th className="border px-3 py-2 text-left">Unidad</th>
              <th className="border px-3 py-2 text-center">Stock Actual</th>
              <th className="border px-3 py-2 text-center">Stock Mínimo</th>
              <th className="border px-3 py-2 text-center">Estado</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {niveles.map((i, idx) => {
              const alerta = i.stock < i.stock_minimo ? "BAJO" : "OK";
              return (
                <tr
                  key={i.insumo_id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                >
                  <td className="border px-3 py-2">{i.nombre}</td>
                  <td className="border px-3 py-2">{i.unidad_medida}</td>
                  <td className="border px-3 py-2 text-center">{i.stock}</td>
                  <td className="border px-3 py-2 text-center">{i.stock_minimo}</td>
                  <td className="border px-3 py-2 text-center">
                    {alerta === "BAJO" ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-300 font-semibold">
                        Stock Bajo
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-300 font-semibold">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => openModal(i)}
                      className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded hover:bg-yellow-200 transition"
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              );
            })}
            {niveles.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Sin datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[420px] animate-fade-in-down">
            <h3 className="text-lg font-bold mb-4 text-gray-800">✏️ Editar Stock Mínimo</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Insumo</label>
                <input
                  type="text"
                  value={editNombre}
                  disabled
                  className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stock Mínimo</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.stock_minimo}
                  onChange={(e) => setForm({ stock_minimo: e.target.value })}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {err && <p className="text-red-600 mt-2">{err}</p>}

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
