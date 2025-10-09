import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { getTasks, updateTaskStatus, startTask, pauseTask } from '../../api/kanban';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ onAddConsumption, onReportIncidencia }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOperario, setFilterOperario] = useState('');
  const { user } = useAppContext();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error cargando tareas:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const moveTask = async (taskId, newStatus) => {
    try {
      const taskToMove = tasks.find(task => task.task_id === taskId);

      if (taskToMove.estado === 'En Curso' && newStatus === 'Por Hacer') {
        console.warn('⚠️ No se puede mover una tarea "En Curso" de vuelta a "Por Hacer".');
        return;
      }
      if (taskToMove.estado === 'Terminado') {
        console.warn('⚠️ No se puede mover una tarea que ya está terminada.');
        return;
      }

      await updateTaskStatus(taskId, { estado: newStatus });

      if (newStatus === 'En Curso') {
        await startTask(taskId);
      } else if (newStatus === 'Por Hacer' && taskToMove.estado === 'En Curso') {
        await pauseTask(taskId);
      }

      await fetchTasks();
    } catch (err) {
      console.error('Error moviendo tarea:', err);
    }
  };

  const handleTaskClick = (task) => {
    if (user?.role.toLowerCase() === 'operario') {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddConsumption = () => {
    if (onAddConsumption) {
      onAddConsumption(selectedTask);
    }
    handleCloseModal();
  };

  const handleReportIncidencia = () => {
    if (onReportIncidencia) {
      onReportIncidencia(selectedTask);
    }
    handleCloseModal();
  };

  const TaskModal = () => {
    if (!selectedTask) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="relative p-6 bg-white w-96 max-h-screen flex flex-col rounded-xl shadow-xl">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            onClick={handleCloseModal}
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Opciones de Tarea</h2>
          <p className="mb-6 text-sm text-gray-600">
            Tarea seleccionada: <span className="font-medium">{selectedTask.title}</span>
          </p>
          <button
            className="mb-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            onClick={handleAddConsumption}
          >
            ➕ Registro Rápido de Consumo
          </button>
          <button
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition shadow-sm"
            onClick={handleReportIncidencia}
          >
            ⚠️ Reportar Incidencia
          </button>
        </div>
      </div>
    );
  };

  const columns = ['Por Hacer', 'En Curso', 'Terminado'];
  const operarios = [...new Set(tasks.map(t => t.operario_nombre))];

  return (
    <div className="p-6 min-h-screen bg-gray-50 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        {user?.role?.toLowerCase() === 'supervisor' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
          >
            ← Ir al Dashboard
          </button>
        )}

        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex-1 text-center">
          📌 Kanban
        </h1>

        <div className="w-28" /> {/* espacio para equilibrar */}
      </div>

      {/* Filtro de Operarios (solo supervisores) */}
      {user?.role?.toLowerCase() === 'supervisor' && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Operario
          </label>
          <select
            value={filterOperario}
            onChange={(e) => setFilterOperario(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los Operarios</option>
            {operarios.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <KanbanColumn
            key={col}
            title={col}
            tasks={tasks.filter((t) =>
              t.estado === col &&
              (filterOperario ? t.operario_nombre === filterOperario : true)
            )}
            onMoveTask={moveTask}
            onAction={fetchTasks}
            showOperario={user?.role.toLowerCase() === 'supervisor'}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      {isModalOpen && <TaskModal />}
    </div>
  );
}
