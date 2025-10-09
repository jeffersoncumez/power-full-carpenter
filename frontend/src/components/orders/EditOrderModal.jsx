import { useState, useEffect } from "react";
import { getOperarios } from "../../api/users";
import { getParametros } from "../../api/parametros";
import { updateOrder } from "../../api/orders";

export default function EditOrderModal({ isOpen, onClose, order, onSave }) {
  const [form, setForm] = useState({
    nombre_cliente: "",
    area: "",
    prioridad: "Normal",
    descripcion: "",
    fecha_compromiso: "",
    asignado_a: "",
  });

  const [operarios, setOperarios] = useState([]);
  const [paramAreas, setParamAreas] = useState([]);
  const [paramPrioridades, setParamPrioridades] = useState([]);

  useEffect(() => {
    if (order) {
      setForm({
        nombre_cliente: order.nombre_cliente || "",
        area: order.area || "",
        prioridad: order.prioridad || "Normal",
        descripcion: order.descripcion || "",
        fecha_compromiso: order.fecha_compromiso
          ? new Date(order.fecha_compromiso).toISOString().split("T")[0]
          : "",
        asignado_a: order.asignado_a || "",
      });
    }
  }, [order]);

  useEffect(() => {
    (async () => {
      try {
        const ops = await getOperarios();
        setOperarios(ops);

        const areas = await getParametros("area");
        setParamAreas(areas);

        const prioridades = await getParametros("prioridad");
        setParamPrioridades(prioridades);
      } catch (err) {
        console.error("Error cargando parámetros dinámicos:", err);
      }
    })();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateOrder(order.pedido_id, {
        ...form,
        asignado_a: Number(form.asignado_a) || null,
      });
      onSave(updated);
      onClose();
    } catch (err) {
      console.error("Error al actualizar pedido:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 animate-fade-in-down relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Título */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">
          ✏️ Editar Pedido
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <label htmlFor="nombre_cliente" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <input
              id="nombre_cliente"
              type="text"
              name="nombre_cliente"
              value={form.nombre_cliente}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Área */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <select
              id="area"
              name="area"
              value={form.area}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un área</option>
              {paramAreas.map((a) => (
                <option key={a.parametro_id} value={a.valor}>
                  {a.valor}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {paramPrioridades.map((p) => (
                <option key={p.parametro_id} value={p.valor}>
                  {p.valor}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fecha compromiso */}
          <div>
            <label htmlFor="fecha_compromiso" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Compromiso
            </label>
            <input
              id="fecha_compromiso"
              type="date"
              name="fecha_compromiso"
              value={form.fecha_compromiso}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Operario */}
          <div>
            <label htmlFor="asignado_a" className="block text-sm font-medium text-gray-700 mb-1">
              Operario Asignado
            </label>
            <select
              id="asignado_a"
              name="asignado_a"
              value={form.asignado_a || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleccionar Operario --</option>
              {operarios.map((op) => (
                <option key={op.user_id} value={op.user_id}>
                  {op.name} ({op.email})
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
