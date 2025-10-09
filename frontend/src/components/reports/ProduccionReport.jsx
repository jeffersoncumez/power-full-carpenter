import { useEffect, useState } from "react";
import { getProduccion } from "../../api/reports";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProduccionReport() {
  const [data, setData] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pedidoId, setPedidoId] = useState("");

  const fetchData = async () => {
    const res = await getProduccion(from, to);

    // 🔹 Filtro adicional por pedidoId
    const filtrado = pedidoId
      ? res.filter((d) => String(d.pedido_id) === pedidoId)
      : res;

    setData(filtrado);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();

    // 📌 Título centrado
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Producción", doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    // 📅 Subtítulo con fecha
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generado el: ${new Date().toLocaleDateString("es-ES")}`,
      doc.internal.pageSize.getWidth() / 2,
      22,
      { align: "center" }
    );

    // 📊 Tabla
    autoTable(doc, {
      startY: 30,
      head: [["ID", "Cliente", "Fecha creación", "Fecha cierre"]],
      body: data.map((d) => [
        d.pedido_id,
        d.nombre_cliente,
        d.fecha_creacion
          ? new Date(d.fecha_creacion).toLocaleDateString("es-ES")
          : "—",
        d.fecha_cierre
          ? new Date(d.fecha_cierre).toLocaleDateString("es-ES")
          : "Pendiente",
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("produccion.pdf");
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Cliente", "Fecha creación", "Fecha cierre"],
      ...data.map((d) => [
        d.pedido_id,
        d.nombre_cliente,
        d.fecha_creacion,
        d.fecha_cierre,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "produccion.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        📦 Reporte de Producción
      </h3>

      {/* 🔹 Filtros */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Pedido ID"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />

        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Filtrar
        </button>
        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          PDF
        </button>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
        >
          Excel
        </button>
      </div>

      <p className="mb-2 font-medium text-gray-700">
        Total pedidos terminados: {data.length}
      </p>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Cliente</th>
              <th className="border px-3 py-2">Fecha creación</th>
              <th className="border px-3 py-2">Fecha cierre</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr
                key={d.pedido_id}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="border px-3 py-2">{d.pedido_id}</td>
                <td className="border px-3 py-2">{d.nombre_cliente}</td>
                <td className="border px-3 py-2">
                  {d.fecha_creacion
                    ? new Date(d.fecha_creacion).toLocaleDateString("es-ES")
                    : "—"}
                </td>
                <td
                  className={`border px-3 py-2 font-semibold ${
                    d.fecha_cierre ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {d.fecha_cierre
                    ? new Date(d.fecha_cierre).toLocaleDateString("es-ES")
                    : "Pendiente"}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 italic">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
