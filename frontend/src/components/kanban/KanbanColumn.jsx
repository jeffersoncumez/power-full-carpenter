// /frontend/src/components/kanban/KanbanColumn.jsx
import TaskCard from './TaskCard';

export default function KanbanColumn({ title, tasks, onMoveTask, onAction, showOperario }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, title);
    }
  };

  // 🔹 Colores por columna
  const columnColors = {
    'Por Hacer': 'bg-gray-100 text-gray-700 border-gray-300',
    'En Curso': 'bg-blue-100 text-blue-700 border-blue-300',
    'Terminado': 'bg-green-100 text-green-700 border-green-300',
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col w-80 min-h-[300px] transition hover:shadow-md"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Encabezado */}
      <div
        className={`px-3 py-2 rounded-lg font-semibold text-sm border ${columnColors[title] || 'bg-gray-100 text-gray-700 border-gray-300'} mb-4 text-center`}
      >
        {title} <span className="ml-2 text-xs font-normal text-gray-500">({tasks.length})</span>
      </div>

      {/* Contenedor de tareas */}
      <div className="space-y-4 flex-1">
        {tasks.map((t) => (
          <TaskCard
            key={t.task_id}
            task={t}
            onMoveTask={onMoveTask}
            onAction={onAction}
            showOperario={showOperario}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-400 italic text-center py-6">Sin tareas</p>
        )}
      </div>
    </div>
  );
}
