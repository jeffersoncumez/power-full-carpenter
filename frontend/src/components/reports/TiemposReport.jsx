import { useEffect, useState } from "react";
import { getTiempos } from "../../api/reports";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function TiemposReport() {
  const [resumen, setResumen] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [operarioFilter, setOperarioFilter] = useState("Todos");

  useEffect(() => {
    (async () => {
      try {
        const data = await getTiempos();
        const detalleData = data.detalle || [];

        // 🧮 Recalcular resumen (segundos)
        const agrupado = detalleData.reduce((acc, d) => {
          const key = d.operario;
          if (!acc[key]) acc[key] = { tareas: 0, totalSeg: 0 };
          acc[key].tareas += 1;
          acc[key].totalSeg += Number(d.tiempo_acumulado || 0);
          return acc;
        }, {});

        const resumenFinal = Object.entries(agrupado)
          .map(([operario, v]) => ({
            operario,
            tareas_completadas: v.tareas,
            promedio_seg: v.totalSeg / v.tareas,
            total_seg: v.totalSeg,
          }))
          .sort((a, b) => a.promedio_seg - b.promedio_seg);

        setDetalle(detalleData);
        setResumen(resumenFinal);
      } catch (err) {
        console.error("Error al cargar tiempos:", err);
      }
    })();
  }, []);

  // 🔹 Formato: segundos + horas
  const fmtTiempo = (segundos) => {
    const seg = Number(segundos || 0);
    const horas = seg / 3600;
    return `${seg.toLocaleString("es-ES")} seg (${horas.toFixed(2)} h)`;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Tiempos por Operario", doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generado el: ${new Date().toLocaleDateString("es-ES")}`,
      doc.internal.pageSize.getWidth() / 2,
      22,
      { align: "center" }
    );

    const resumenFiltrado =
      operarioFilter === "Todos"
        ? resumen
        : resumen.filter((r) => r.operario === operarioFilter);

    const detalleFiltrado =
      operarioFilter === "Todos"
        ? detalle
        : detalle.filter((d) => d.operario === operarioFilter);

    // 📊 Tabla Resumen
    autoTable(doc, {
      startY: 30,
      head: [["Operario", "Tareas Completadas", "Promedio", "Total"]],
      body: resumenFiltrado.map((r) => [
        r.operario,
        r.tareas_completadas,
        fmtTiempo(r.promedio_seg),
        fmtTiempo(r.total_seg),
      ]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // 📋 Tabla Detalle
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["ID Tarea", "Pedido", "Cliente", "Área", "Duración", "Fecha Fin", "Operario"]],
      body: detalleFiltrado.map((d) => [
        d.task_id,
        d.pedido_id,
        d.nombre_cliente,
        d.area,
        fmtTiempo(d.tiempo_acumulado),
        d.fecha_fin ? new Date(d.fecha_fin).toLocaleString("es-ES") : "—",
        d.operario,
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });

    doc.save(
      operarioFilter === "Todos"
        ? "tiempos_operario.pdf"
        : `tiempos_${operarioFilter}.pdf`
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">⏱ Reporte de Tiempos por Operario</h2>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <label className="font-semibold text-gray-700">Filtrar por Operario:</label>
        <select
          value={operarioFilter}
          onChange={(e) => setOperarioFilter(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="Todos">Todos</option>
          {resumen.map((r, idx) => (
            <option key={idx} value={r.operario}>
              {r.operario}
            </option>
          ))}
        </select>

        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          disabled={!resumen.length && !detalle.length}
        >
          Exportar PDF
        </button>
      </div>

      {/* 📊 Resumen */}
      <h3 className="font-semibold mb-2">Resumen por Operario</h3>
      <table className="w-full border mb-6 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1">Operario</th>
            <th className="border px-2 py-1">Tareas Completadas</th>
            <th className="border px-2 py-1">Promedio</th>
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {resumen.length > 0 ? (
            resumen.map((r, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-2 py-1">{r.operario}</td>
                <td className="border px-2 py-1">{r.tareas_completadas}</td>
                <td className="border px-2 py-1">{fmtTiempo(r.promedio_seg)}</td>
                <td className="border px-2 py-1">{fmtTiempo(r.total_seg)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-3 text-gray-500 italic">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 📋 Detalle */}
      <h3 className="font-semibold mb-2">Detalle de Tareas</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1">ID Tarea</th>
            <th className="border px-2 py-1">Pedido</th>
            <th className="border px-2 py-1">Cliente</th>
            <th className="border px-2 py-1">Área</th>
            <th className="border px-2 py-1">Duración</th>
            <th className="border px-2 py-1">Fecha Fin</th>
            <th className="border px-2 py-1">Operario</th>
          </tr>
        </thead>
        <tbody>
          {(operarioFilter === "Todos"
            ? detalle
            : detalle.filter((d) => d.operario === operarioFilter)
          ).map((d, idx) => (
            <tr key={d.task_id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border px-2 py-1">{d.task_id}</td>
              <td className="border px-2 py-1">{d.pedido_id}</td>
              <td className="border px-2 py-1">{d.nombre_cliente}</td>
              <td className="border px-2 py-1">{d.area}</td>
              <td className="border px-2 py-1">{fmtTiempo(d.tiempo_acumulado)}</td>
              <td className="border px-2 py-1">
                {d.fecha_fin
                  ? new Date(d.fecha_fin).toLocaleString("es-ES")
                  : "—"}
              </td>
              <td className="border px-2 py-1">{d.operario}</td>
            </tr>
          ))}
          {detalle.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-3 text-gray-500 italic">
                No hay datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
