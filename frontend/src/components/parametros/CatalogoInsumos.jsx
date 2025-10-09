import { useEffect, useState } from "react";
import { getInsumos, addInsumo, updateInsumo, deleteInsumo } from "../../api/insumos";

export default function CatalogoInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    unidad_medida: "",
    stock: 0,
    stock_minimo: 0,
    subcategoria: ""
  });

  // 🔹 Cargar datos
  const loadData = async () => {
    const data = await getInsumos();
    setInsumos(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Abrir modal
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditando(item.insumo_id);
      setForm({
        nombre: item.nombre,
        unidad_medida: item.unidad_medida || "",
        stock: item.stock || 0,
        stock_minimo: item.stock_minimo || 0,
        subcategoria: item.subcategoria || ""
      });
    } else {
      setEditando(null);
      setForm({ nombre: "", unidad_medida: "", stock: 0, stock_minimo: 0, subcategoria: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ nombre: "", unidad_medida: "", stock: 0, stock_minimo: 0, subcategoria: "" });
  };

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Guardar
  const handleSubmit = async () => {
    if (editando) {
      await updateInsumo(editando, { ...form });
    } else {
      await addInsumo({ ...form });
    }
    handleCloseModal();
    loadData();
  };

  // 🔹 Eliminar
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este insumo?")) {
      await deleteInsumo(id);
      loadData();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">📦 Catálogo de Insumos</h3>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          ➕ Agregar Insumo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-3 py-2 text-left">Insumo</th>
              <th className="border px-3 py-2 text-left">Unidad</th>
              <th className="border px-3 py-2 text-center">Stock</th>
              <th className="border px-3 py-2 text-center">Stock Mínimo</th>
              <th className="border px-3 py-2 text-left">Categoría</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((i, idx) => (
              <tr
                key={i.insumo_id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
              >
                <td className="border px-3 py-2">{i.nombre}</td>
                <td className="border px-3 py-2">{i.unidad_medida}</td>
                <td className="border px-3 py-2 text-center">{i.stock}</td>
                <td className="border px-3 py-2 text-center">{i.stock_minimo}</td>
                <td className="border px-3 py-2">{i.subcategoria}</td>
                <td className="border px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(i)}
                    className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded hover:bg-yellow-200 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(i.insumo_id)}
                    className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-200 transition"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {insumos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hay insumos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-fade-in-down">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {editando ? "✏️ Editar Insumo" : "➕ Agregar Insumo"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del insumo"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="unidad_medida"
                value={form.unidad_medida}
                onChange={handleChange}
                placeholder="Unidad (ej: m², litros, unidades)"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock Inicial"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="stock_minimo"
                value={form.stock_minimo}
                onChange={handleChange}
                placeholder="Stock Mínimo"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="subcategoria"
                value={form.subcategoria}
                onChange={handleChange}
                placeholder="Categoría (ej: Ferretería, Pintura, Materiales)"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {editando ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
