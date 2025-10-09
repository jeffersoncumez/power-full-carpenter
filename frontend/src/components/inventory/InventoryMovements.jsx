import { useEffect, useState } from 'react';
import { getIncidencias, updateIncidenciaEstado } from '../../api/inventory';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function IncidenciasList() {
  const [incidencias, setIncidencias] = useState([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);
  const [filterOperario, setFilterOperario] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterUrgencia, setFilterUrgencia] = useState('');

  const fetchData = async () => {
    try {
      const data = await getIncidencias();
      setIncidencias(data);
    } catch (err) {
      console.error('Error cargando incidencias', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = incidencias.filter(i => {
      const operarioMatch = filterOperario ? i.operario_nombre === filterOperario : true;
      const tipoMatch = filterTipo ? i.tipo === filterTipo : true;
      const urgenciaMatch = filterUrgencia ? i.urgencia === filterUrgencia : true;
      return operarioMatch && tipoMatch && urgenciaMatch;
    });
    setFilteredIncidencias(filtered);
  }, [incidencias, filterOperario, filterTipo, filterUrgencia]);

  const handleEstado = async (id, estado) => {
    try {
      await updateIncidenciaEstado(id, estado);
      
      setIncidencias(prevIncidencias =>
        prevIncidencias.map(inc =>
          inc.incidencia_id === id ? { ...inc, estado: estado } : inc
        )
      );
    } catch (err) {
      console.error('Error actualizando estado', err);
    }
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Incidencias", 14, 16);
    
    const headers = [
      "Fecha",
      "Operario",
      "Tarea",
      "Tipo",
      "Descripción",
      "Urgencia",
      "Estado",
    ];

    const data = filteredIncidencias.map(incidencia => [
      new Date(incidencia.fecha).toLocaleString(),
      incidencia.operario_nombre,
      incidencia.tarea_titulo,
      incidencia.tipo,
      incidencia.descripcion,
      incidencia.urgencia,
      incidencia.estado,
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fontSize: 9, halign: 'left' },
      columnStyles: {
        0: { cellWidth: 25 },  // Fecha
        1: { cellWidth: 25 },  // Operario
        2: { cellWidth: 25 },  // Tarea
        3: { cellWidth: 15 },  // Tipo
        4: { cellWidth: 40 },  // Descripción
        5: { cellWidth: 20 },  // Urgencia
        6: { cellWidth: 20 },  // Estado
      },
    });
    
    doc.save("incidencias_reporte.pdf");
  };

  const filterOptions = {
    operarios: [...new Set(incidencias.map(i => i.operario_nombre))],
    tipos: [...new Set(incidencias.map(i => i.tipo))],
    urgencias: [...new Set(incidencias.map(i => i.urgencia))],
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Incidencias reportadas</h2>
        <button
          onClick={handleExportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Exportar PDF
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          onChange={(e) => setFilterOperario(e.target.value)}
          value={filterOperario}
          className="p-2 border rounded"
        >
          <option value="">Filtrar por Operario</option>
          {filterOptions.operarios.map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>

        <select
          onChange={(e) => setFilterTipo(e.target.value)}
          value={filterTipo}
          className="p-2 border rounded"
        >
          <option value="">Filtrar por Tipo</option>
          {filterOptions.tipos.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          onChange={(e) => setFilterUrgencia(e.target.value)}
          value={filterUrgencia}
          className="p-2 border rounded"
        >
          <option value="">Filtrar por Urgencia</option>
          {filterOptions.urgencias.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Operario</th>
            <th className="p-2 border">Tarea</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Urgencia</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncidencias.length > 0 ? (
            filteredIncidencias.map(i => (
              <tr key={i.incidencia_id}>
                <td className="p-2 border">{new Date(i.fecha).toLocaleString()}</td>
                <td className="p-2 border">{i.operario_nombre}</td>
                <td className="p-2 border">{i.tarea_titulo}</td>
                <td className="p-2 border">{i.tipo}</td>
                <td className="p-2 border">{i.descripcion}</td>
                <td className="p-2 border">{i.urgencia}</td>
                <td className="p-2 border">{i.estado}</td>
                <td className="p-2 border space-x-2">
                  {i.estado === 'Pendiente' && (
                    <button
                      onClick={() => handleEstado(i.incidencia_id, 'En revisión')}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Revisar
                    </button>
                  )}
                  {i.estado === 'En revisión' && (
                    <button
                      onClick={() => handleEstado(i.incidencia_id, 'Resuelto')}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Resolver
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                No hay incidencias que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}