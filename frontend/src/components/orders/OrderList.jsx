import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus, updateOrder } from "../../api/orders";
import { getParametros } from "../../api/parametros";
import EditOrderModal from "./EditOrderModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// 🔹 Badge de prioridad
function PrioridadBadge({ prioridad }) {
  if (!prioridad) return null;
  let colorClass = "bg-gray-200 text-gray-700 border border-gray-300";
  if (prioridad.toLowerCase() === "alta")
    colorClass = "bg-red-100 text-red-700 border border-red-300";
  if (["media", "normal"].includes(prioridad.toLowerCase()))
    colorClass = "bg-yellow-100 text-yellow-700 border border-yellow-300";
  if (prioridad.toLowerCase() === "baja")
    colorClass = "bg-green-100 text-green-700 border border-green-300";

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${colorClass}`}
    >
      {prioridad}
    </span>
  );
}

export default function OrderList({ refresh }) {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [editingOrder, setEditingOrder] = useState(null);
  const [verMas, setVerMas] = useState(false);


  const [estado, setEstado] = useState("Todos");
  const [area, setArea] = useState("Todos");
  const [prioridad, setPrioridad] = useState("Todos");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [orden, setOrden] = useState("");
  const [paramAreas, setParamAreas] = useState([]);

  // 🚀 Leer cliente_id de la URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const clienteIdFiltro = searchParams.get("cliente_id");

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    (async () => {
      try {
        const areas = await getParametros("area");
        setParamAreas(areas);
      } catch (err) {
        console.error("Error cargando áreas dinámicas:", err);
      }
    })();
  }, [refresh]);

  // Filtros + ordenamiento
  useEffect(() => {
    let data = [...orders];

    // 🚀 Filtro por cliente_id (desde la URL)
    if (clienteIdFiltro) {
      data = data.filter((o) => String(o.cliente_id) === clienteIdFiltro);
    }

    if (estado !== "Todos") data = data.filter((o) => o.estado === estado);
    if (area !== "Todos") data = data.filter((o) => o.area === area);
    if (prioridad !== "Todos") data = data.filter((o) => o.prioridad === prioridad);
    if (desde) {
      data = data.filter((o) =>
        o.fecha_compromiso
          ? new Date(o.fecha_compromiso) >= new Date(desde)
          : true
      );
    }
    if (hasta) {
      data = data.filter((o) =>
        o.fecha_compromiso
          ? new Date(o.fecha_compromiso) <= new Date(hasta)
          : true
      );
    }

    if (orden === "fecha_compromiso") {
      data.sort((a, b) => {
        const dateA = a.fecha_compromiso
          ? new Date(a.fecha_compromiso)
          : new Date(0);
        const dateB = b.fecha_compromiso
          ? new Date(b.fecha_compromiso)
          : new Date(0);
        return dateA - dateB;
      });
    } else if (orden === "prioridad") {
      const orderPriority = { Alta: 1, Normal: 2, Media: 2, Baja: 3 };
      data.sort(
        (a, b) =>
          (orderPriority[a.prioridad] || 99) -
          (orderPriority[b.prioridad] || 99)
      );
    } else {
      data.sort((a, b) => b.pedido_id - a.pedido_id);
    }

    setFiltered(data);
  }, [orders, estado, area, prioridad, desde, hasta, orden, clienteIdFiltro]);

  const handleStatusChange = async (pedidoId, nuevoEstado) => {
    try {
      const updated = await updateOrderStatus(pedidoId, nuevoEstado);
      if (updated) {
        setOrders((prev) =>
          prev.map((o) =>
            o.pedido_id === pedidoId
              ? { ...o, estado: nuevoEstado, fecha_cierre: new Date() }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Error al actualizar pedido:", err);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  const handleEdit = (order) => setEditingOrder(order);

  const handleSave = async (updatedOrder) => {
    try {
      await updateOrder(updatedOrder.pedido_id, updatedOrder);
      fetchOrders();
      setEditingOrder(null);
    } catch (err) {
      console.error("Error al editar pedido:", err);
    }
  };

  const limpiarFiltroCliente = () => {
    searchParams.delete("cliente_id");
    setSearchParams(searchParams);
    navigate("/pedidos"); // refresca la URL sin el query
  };

  const exportPDF = () => {
    if (!filtered.length) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Lista de Pedidos", 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [["ID", "Cliente", "Descripción", "Estado", "Prioridad", "Área", "Fecha Compromiso", "Tarea", "Operario"]],
      body: filtered.map((o) => [
        o.pedido_id,
        o.nombre_cliente,
        o.descripcion || "—",
        o.estado,
        o.prioridad || "—",
        o.area || "—",
        o.fecha_compromiso ? new Date(o.fecha_compromiso).toLocaleDateString("es-ES") : "—",
        o.tarea_titulo || "—",
        o.operario_nombre || "No asignado",
      ]),
      styles: { fontSize: 8 },
    });

    doc.save("pedidos.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-bold text-gray-800">📦 Lista de Pedidos</h2>

      {/* 🚀 Banner de filtro activo */}
      {clienteIdFiltro && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-800 flex items-center justify-between">
          📌 Filtrando pedidos del cliente <b>#{clienteIdFiltro}</b>{" "}
          {filtered.length > 0 && (
            <span className="ml-2">
              (<b>{filtered[0].nombre_cliente}</b>)
            </span>
          )}
          <button
            onClick={limpiarFiltroCliente}
            className="ml-4 text-red-600 hover:underline"
          >
            ❌ Limpiar filtro
          </button>
        </div>
      )}

      {/* Controles de Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="font-medium">Estado:</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Todos">Todos los estados</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Terminado">Terminado</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <label className="font-medium">Área:</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Todos">Todas las áreas</option>
            {paramAreas.map((a) => (
              <option key={a.parametro_id} value={a.valor}>
                {a.valor}
              </option>
            ))}
          </select>

          <label className="font-medium">Prioridad:</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Todos">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Normal">Normal</option>
            <option value="Baja">Baja</option>
          </select>

          <label className="font-medium">Desde:</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border px-2 py-1 rounded"
          />

          <label className="font-medium">Hasta:</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border px-2 py-1 rounded"
          />

          <label className="font-medium">Ordenar por:</label>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Seleccionar Orden</option>
            <option value="fecha_compromiso">Fecha Compromiso</option>
            <option value="prioridad">Prioridad</option>
          </select>

          <button
            onClick={exportPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!filtered.length}
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Tabla */}
      {/* Tabla con paginación */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2">ID</th>
              <th className="border px-2 py-2">Cliente</th>
              <th className="border px-2 py-2">Descripción</th>
              <th className="border px-2 py-2">Estado</th>
              <th className="border px-2 py-2">Prioridad</th>
              <th className="border px-2 py-2">Área</th>
              <th className="border px-2 py-2">Fecha Compromiso</th>
              <th className="border px-2 py-2">Tarea</th>
              <th className="border px-2 py-2">Operario</th>
              <th className="border px-2 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina)
              .map((o) => (
                <tr key={o.pedido_id} className="hover:bg-gray-50 transition-colors">
                  <td className="border px-2 py-1">{o.pedido_id}</td>
                  <td className="border px-2 py-1">{o.nombre_cliente}</td>
                  <td className="border px-2 py-1">{o.descripcion || "—"}</td>
                  <td className="border px-2 py-1">{o.estado}</td>
                  <td className="border px-2 py-1">
                    <PrioridadBadge prioridad={o.prioridad} />
                  </td>
                  <td className="border px-2 py-1">{o.area || "—"}</td>
                  <td className="border px-2 py-1">
                    {o.fecha_compromiso
                      ? new Date(o.fecha_compromiso).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="border px-2 py-1">{o.tarea_titulo || "—"}</td>
                  <td className="border px-2 py-1">
                    {o.operario_nombre
                      ? `${o.operario_nombre} (${o.operario_email})`
                      : "No asignado"}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    {o.estado === "En Proceso" && (
                      <>
                        <button
                          className="bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded hover:bg-green-200 transition"
                          onClick={() => handleStatusChange(o.pedido_id, "Terminado")}
                        >
                          Terminar
                        </button>
                        <button
                          className="bg-red-100 text-red-700 border border-red-300 px-2 py-1 rounded hover:bg-red-200 transition"
                          onClick={() => handleStatusChange(o.pedido_id, "Cancelado")}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-gray-100 text-gray-700 border border-gray-300 px-2 py-1 rounded hover:bg-gray-200 transition"
                          onClick={() => handleEdit(o)}
                        >
                          Editar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No hay pedidos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginación */}
      {filtered.length > itemsPorPagina && (
        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className={`px-3 py-1 rounded border ${
              paginaActual === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            « Anterior
          </button>

          {Array.from(
            { length: Math.ceil(filtered.length / itemsPorPagina) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setPaginaActual(i + 1)}
                className={`px-3 py-1 rounded border ${
                  paginaActual === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            onClick={() =>
              setPaginaActual((p) =>
                Math.min(p + 1, Math.ceil(filtered.length / itemsPorPagina))
              )
            }
            disabled={paginaActual === Math.ceil(filtered.length / itemsPorPagina)}
            className={`px-3 py-1 rounded border ${
              paginaActual === Math.ceil(filtered.length / itemsPorPagina)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Siguiente »
          </button>
        </div>
      )}


      {/* Modal de edición */}
      <EditOrderModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        order={editingOrder}
        onSave={handleSave}
      />
    </div>
  );
}
