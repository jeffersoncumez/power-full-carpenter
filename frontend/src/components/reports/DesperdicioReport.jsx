import { useEffect, useState } from "react";
import { getDesperdicio } from "../../api/reports";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DesperdicioReport() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchData = async () => {
    try {
      const res = await getDesperdicio(from, to); // 👉 pasa las fechas al backend
      setData(res);
    } catch (err) {
      console.error("Error cargando desperdicio:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();

    // 📌 Título
    doc.setFontSize(14);
    doc.text("Reporte de Desperdicio de Insumos", 14, 16);

    // 📅 Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-ES")}`, 14, 24);

    // 🔎 Filtros aplicados
    let filtrosTexto = [];
    if (from) filtrosTexto.push(`Desde: ${new Date(from).toLocaleDateString("es-ES")}`);
    if (to) filtrosTexto.push(`Hasta: ${new Date(to).toLocaleDateString("es-ES")}`);

    if (filtrosTexto.length > 0) {
      doc.setFontSize(10);
      doc.text(`Filtros aplicados: ${filtrosTexto.join(" | ")}`, 14, 30);
    }

    let currentY = filtrosTexto.length > 0 ? 36 : 32;

    // 📝 Resumen
    const totalSalida = data?.total_salida || 0;
    const totalDesperdicio = data?.total_ajuste || 0;
    const porcentaje = data?.porcentaje || 0;

    doc.setFontSize(11);
    doc.text(
      `Se procesaron ${totalSalida} insumos con un desperdicio total de ${totalDesperdicio} (${porcentaje}%).`,
      14,
      currentY
    );

    // 📊 Tabla resumen
    autoTable(doc, {
      startY: currentY + 6,
      head: [["Total Salida", "Total Desperdicio", "Porcentaje"]],
      body: [[totalSalida, totalDesperdicio, porcentaje + " %"]],
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    // 📋 Detalle con fecha
    if (data?.detalle?.length) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Fecha", "Insumo", "Cantidad Ajustada", "Unidad", "Motivo"]],
        body: data.detalle.map((d) => [
          d.fecha || "—",
          d.insumo,
          d.cantidad_ajustada,
          d.unidad_medida,
          d.motivo || "—",
        ]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [52, 152, 219], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    doc.save("desperdicio.pdf");
  };


  if (!data) return <p className="italic text-gray-500">Cargando...</p>;

  const chartData = [
    { name: "Uso Normal", value: (data.total_salida || 0) - (data.total_ajuste || 0) },
    { name: "Desperdicio", value: data.total_ajuste || 0 },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🗑️ Reporte de Desperdicio</h3>

      {/* 🔎 Filtros por rango de fechas */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Desde:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hasta:</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta resumen */}
        <div className="p-4 border rounded-lg bg-gray-50 space-y-1">
          <p><strong>Total Salida:</strong> {data.total_salida || 0}</p>
          <p><strong>Total Desperdicio:</strong> {data.total_ajuste || 0}</p>
          <p
            className={`${
              data.porcentaje > 10
                ? "text-red-600 font-bold"
                : "text-green-600 font-medium"
            }`}
          >
            <strong>Porcentaje:</strong> {data.porcentaje || 0} %
          </p>
        </div>

        {/* Gráfico circular */}
        <div className="flex justify-center items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de detalle */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2 text-gray-800">📋 Detalle por Insumo</h4>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Fecha</th>
                <th className="border px-3 py-2 text-left">Insumo</th>
                <th className="border px-3 py-2 text-center">Cantidad Ajustada</th>
                <th className="border px-3 py-2 text-center">Unidad</th>
                <th className="border px-3 py-2 text-left">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {data.detalle.length > 0 ? (
                data.detalle.map((d, i) => (
                  <tr
                    key={i}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                  >
                    <td className="border px-3 py-2">{d.fecha}</td>
                    <td className="border px-3 py-2">{d.insumo}</td>
                    <td className="border px-3 py-2 text-center">{d.cantidad_ajustada}</td>
                    <td className="border px-3 py-2 text-center">{d.unidad_medida}</td>
                    <td className="border px-3 py-2">{d.motivo || "—"}</td>
                  </tr>
                ))
              ) : (
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

      {/* Botón de exportar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={exportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
        >
          📄 Exportar PDF
        </button>
      </div>
    </div>
  );
}
