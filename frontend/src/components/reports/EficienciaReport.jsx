import { useEffect, useState } from "react";
import { getEficiencia } from "../../api/reports";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function EficienciaReport() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchData = async () => {
    try {
      const res = await getEficiencia(from, to);
      setData(res);
    } catch (e) {
      console.error("Error cargando eficiencia:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <p className="italic text-gray-500">Cargando...</p>;

  const { resumen = {}, detalle = [] } = data;

  const eficienciaPedidos =
    resumen.total_pedidos > 0
      ? ((resumen.pedidos_completados / resumen.total_pedidos) * 100).toFixed(2)
      : 0;

  const eficienciaTareas =
    resumen.total_tareas > 0
      ? ((resumen.tareas_completadas / resumen.total_tareas) * 100).toFixed(2)
      : 0;

  const exportPDF = () => {
    const doc = new jsPDF();

    // 📌 Título
    doc.setFontSize(14);
    doc.text("Reporte de Eficiencia Operativa", 14, 16);

    // 📅 Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-ES")}`, 14, 24);

    // 🔎 Filtros aplicados
    let filtrosTexto = [];
    if (from)
      filtrosTexto.push(
        `Desde: ${new Date(from).toLocaleDateString("es-ES")}`
      );
    if (to)
      filtrosTexto.push(
        `Hasta: ${new Date(to).toLocaleDateString("es-ES")}`
      );

    if (filtrosTexto.length > 0) {
      doc.setFontSize(10);
      doc.text(`Filtros aplicados: ${filtrosTexto.join(" | ")}`, 14, 30);
    }

    let currentY = filtrosTexto.length > 0 ? 36 : 32;

    // 📌 Resumen
    doc.setFontSize(12);
    doc.text("Resumen:", 14, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Métrica", "Valor"]],
      body: [
        ["Pedidos Totales", resumen.total_pedidos ?? 0],
        ["Pedidos Completados", resumen.pedidos_completados ?? 0],
        ["% Eficiencia Pedidos", eficienciaPedidos + "%"],
        ["Tareas Totales", resumen.total_tareas ?? 0],
        ["Tareas Completadas", resumen.tareas_completadas ?? 0],
        ["% Eficiencia Tareas", eficienciaTareas + "%"],
      ],
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    // 📌 Detalle
    doc.setFontSize(12);
    doc.text("Detalle por Operario:", 14, doc.lastAutoTable.finalY + 12);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 18,
      head: [["Operario", "Tareas Completadas"]],
      body: detalle.map((d) => [d.operario, d.tareas_completadas]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
    });

    doc.save("eficiencia.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📊 Reporte de Eficiencia Operativa
      </h2>

      {/* Filtros por rango de fechas */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Desde:
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hasta:
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Aplicar Filtro
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="p-4 border rounded-lg bg-gray-50 mb-6">
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            <strong>Pedidos Totales:</strong> {resumen.total_pedidos ?? 0}
          </li>
          <li>
            <strong>Pedidos Completados:</strong>{" "}
            {resumen.pedidos_completados ?? 0}{" "}
            <span
              className={
                eficienciaPedidos > 80
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              ({eficienciaPedidos}%)
            </span>
          </li>
          <li>
            <strong>Tareas Totales:</strong> {resumen.total_tareas ?? 0}
          </li>
          <li>
            <strong>Tareas Completadas:</strong>{" "}
            {resumen.tareas_completadas ?? 0}{" "}
            <span
              className={
                eficienciaTareas > 80
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              ({eficienciaTareas}%)
            </span>
          </li>
        </ul>
      </div>

      {/* Tabla detalle */}
      <h3 className="font-semibold text-gray-800 mb-2">
        👷 Detalle por Operario
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">Operario</th>
              <th className="border px-3 py-2 text-center">
                Tareas Completadas
              </th>
            </tr>
          </thead>
          <tbody>
            {detalle.length > 0 ? (
              detalle.map((d, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="border px-3 py-2">{d.operario}</td>
                  <td className="border px-3 py-2 text-center">
                    {d.tareas_completadas}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No hay datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botón PDF */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          📄 Exportar PDF
        </button>
      </div>
    </div>
  );
}
