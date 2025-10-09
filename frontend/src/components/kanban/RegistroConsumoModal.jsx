import { useEffect, useState } from "react";
import { registrarConsumoRapido, getInsumos } from "../../api/inventory";
import { getMotivos } from "../../api/parametros";

export default function RegistroConsumoModal({ visible, task, onClose, onSuccess }) {
  const [insumos, setInsumos] = useState([]);
  const [insumoId, setInsumoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");

  const [motivos, setMotivos] = useState([]);
  const [motivo, setMotivo] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMotivos, setLoadingMotivos] = useState(false);

  // Cargar insumos y motivos cuando el modal sea visible
  useEffect(() => {
    if (!visible) return;

    // Insumos
    setLoading(true);
    getInsumos()
      .then((data) => setInsumos(data || []))
      .catch((e) => {
        console.error("Error cargando insumos:", e);
        setInsumos([]);
      })
      .finally(() => setLoading(false));

    // Motivos dinámicos
    setLoadingMotivos(true);
    getMotivos()
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setMotivos(data);
        } else {
          setMotivos([
            { parametro_id: 1, valor: "Producción" },
            { parametro_id: 2, valor: "Error de corte" },
            { parametro_id: 3, valor: "Defecto de material" },
            { parametro_id: 4, valor: "Pérdida en transporte" },
          ]);
        }
      })
      .catch((e) => {
        console.error("Error cargando motivos:", e);
        setMotivos([
          { parametro_id: 1, valor: "Producción" },
          { parametro_id: 2, valor: "Error de corte" },
          { parametro_id: 3, valor: "Defecto de material" },
          { parametro_id: 4, valor: "Pérdida en transporte" },
        ]);
      })
      .finally(() => setLoadingMotivos(false));
  }, [visible]);

  // Cuando selecciones un insumo, mostramos su unidad
  const handleSelectInsumo = (e) => {
    const id = e.target.value;
    setInsumoId(id);
    const found = insumos.find((i) => i.insumo_id === Number(id));
    setUnidad(found?.unidad_medida || "");
  };

  // Enviar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!insumoId || !cantidad || Number(cantidad) <= 0 || !motivo) {
      alert("Debes seleccionar insumo, motivo y una cantidad válida.");
      return;
    }

    try {
      await registrarConsumoRapido({
        taskId: task.task_id,
        insumoId: Number(insumoId),
        cantidad: Number(cantidad),
        motivo: String(motivo),
      });
      alert("✅ Consumo registrado correctamente");
      onSuccess?.();

      // limpiar estados
      setInsumoId("");
      setCantidad("");
      setUnidad("");
      setMotivo("");

      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error registrando consumo");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in-down">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-extrabold text-gray-800">🛠️ Registro de Consumo</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Nombre de tarea */}
        <p className="text-sm text-gray-600 mb-4">
          Tarea seleccionada: <span className="font-medium">{task?.title}</span>
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Insumo */}
          <div>
            <label htmlFor="insumo" className="block text-sm font-medium text-gray-700 mb-1">
              Insumo
            </label>
            <select
              id="insumo"
              name="insumo"
              value={insumoId}
              onChange={handleSelectInsumo}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">{loading ? "Cargando..." : "Seleccione un insumo"}</option>
              {insumos.map((i) => (
                <option key={i.insumo_id} value={i.insumo_id}>
                  {i.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
              step="any"
            />
          </div>

          {/* Unidad */}
          <div>
            <label htmlFor="unidad" className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <input
              id="unidad"
              name="unidad"
              type="text"
              value={unidad}
              readOnly
              className="w-full border px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-600"
            />
          </div>

          {/* Motivo dinámico */}
          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <select
              id="motivo"
              name="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loadingMotivos}
            >
              <option value="">{loadingMotivos ? "Cargando..." : "Seleccione un motivo"}</option>
              {motivos.map((m) => (
                <option key={m.parametro_id ?? m.valor} value={m.valor}>
                  {m.valor}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
