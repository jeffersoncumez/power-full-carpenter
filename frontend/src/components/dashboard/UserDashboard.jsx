import { useEffect, useState } from 'react';
import { getTasks } from '../../api/kanban';

export default function UserDashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const t = await getTasks({ asignado_a: user.user_id });
        setTasks(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* 🔹 Encabezado */}
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight">
        📋 Tareas asignadas
      </h1>

      {/* 🔹 Lista de tareas */}
      {tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t.task_id}
              className="bg-white border border-gray-100 shadow-sm rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <span className="font-medium text-gray-700">{t.nombre_tarea}</span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold
                  ${
                    t.estado === 'Completada'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : t.estado === 'En progreso'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }
                `}
              >
                {t.estado}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No tienes tareas asignadas 🚀</p>
      )}
    </div>
  );
}
