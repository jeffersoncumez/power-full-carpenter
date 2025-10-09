import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { getIncidencias, updateIncidenciaEstado } from '../../api/inventory';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function IncidenciasList() {
  const [incidencias, setIncidencias] = useState([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);
  const [filterOperario, setFilterOperario] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterUrgencia, setFilterUrgencia] = useState('');

  const navigate = useNavigate();
  const { user } = useAppContext();

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
      setIncidencias(prev =>
        prev.map(inc =>
          inc.incidencia_id === id ? { ...inc, estado } : inc
        )
      );
    } catch (err) {
      console.error('Error actualizando estado', err);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Incidencias", 14, 16);

    const headers = ["Fecha", "Operario", "Tarea", "Tipo", "Descripción", "Urgencia", "Estado"];

    const data = filteredIncidencias.map(incidencia => [
      new Date(incidencia.fecha).toLocaleString(),
      incidencia.operario_nombre,
      incidencia.tarea_titulo,
      incidencia.tipo,
      incidencia.descripcion,
      incidencia.urgencia,
      incidencia.estado,
    ]);

    autoTable(doc, { head: [headers], body: data, startY: 20 });
    doc.save("incidencias_reporte.pdf");
  };

  const filterOptions = {
    operarios: [...new Set(incidencias.map(i => i.operario_nombre))],
    tipos: [...new Set(incidencias.map(i => i.tipo))],
    urgencias: [...new Set(incidencias.map(i => i.urgencia))],
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* 🔹 Encabezado con acción */}
      <div className="flex items-center justify-between mb-8">
        {user?.role?.toLowerCase() === 'supervisor' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 shadow-sm transition"
          >
            ← Ir al Dashboard
          </button>
        )}

        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex-1 text-center">
          🛠️ Incidencias
        </h1>
      </div>

      {/* 🔹 Filtros + Exportar */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Filtros</h2>
        <div className="flex flex-wrap items-center gap-4">
          <select
            onChange={(e) => setFilterOperario(e.target.value)}
            value={filterOperario}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Operarios</option>
            {filterOptions.operarios.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>

          <select
            onChange={(e) => setFilterTipo(e.target.value)}
            value={filterTipo}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Tipos</option>
            {filterOptions.tipos.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            onChange={(e) => setFilterUrgencia(e.target.value)}
            value={filterUrgencia}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las Urgencias</option>
            {filterOptions.urgencias.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {/* 📌 Botón Exportar PDF al lado de filtros */}
          <button
            onClick={handleExportPDF}
            className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 active:bg-green-800 shadow-sm transition"
            disabled={!incidencias.length}
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto bg-white border border-gray-100 shadow-sm rounded-xl">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-3 text-gray-700 font-semibold">Fecha</th>
              <th className="p-3 text-gray-700 font-semibold">Operario</th>
              <th className="p-3 text-gray-700 font-semibold">Tarea</th>
              <th className="p-3 text-gray-700 font-semibold">Tipo</th>
              <th className="p-3 text-gray-700 font-semibold">Descripción</th>
              <th className="p-3 text-gray-700 font-semibold">Urgencia</th>
              <th className="p-3 text-gray-700 font-semibold">Estado</th>
              <th className="p-3 text-gray-700 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidencias.length > 0 ? (
              filteredIncidencias.map(i => (
                <tr
                  key={i.incidencia_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-600">
                    {new Date(i.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{i.operario_nombre}</td>
                  <td className="p-3 text-gray-700">{i.tarea_titulo}</td>
                  <td className="p-3 text-gray-700">{i.tipo}</td>
                  <td className="p-3 text-gray-600">{i.descripcion}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border
                        ${i.urgencia === 'alta'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : i.urgencia === 'media'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-green-100 text-green-700 border-green-200'
                        }`}
                    >
                      {i.urgencia}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${i.estado === 'Pendiente' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                        i.estado === 'En revisión' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-green-100 text-green-700 border border-green-200'}`}>
                      {i.estado}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {i.estado === 'Pendiente' && (
                      <button
                        onClick={() => handleEstado(i.incidencia_id, 'En revisión')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-yellow-600 transition"
                      >
                        Revisar
                      </button>
                    )}
                    {i.estado === 'En revisión' && (
                      <button
                        onClick={() => handleEstado(i.incidencia_id, 'Resuelto')}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition"
                      >
                        Resolver
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500 italic">
                  No hay incidencias que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
