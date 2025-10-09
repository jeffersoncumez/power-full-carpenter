import { useAppContext } from '../../contexts/AppContext';

export default function Navbar() {
  const { user, logout } = useAppContext();

  return (
    <div className="absolute top-0 right-0 p-4 flex items-center space-x-4">
      {user && (
        // Contenedor para el "botón" de usuario con el punto verde
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium shadow-sm flex items-center space-x-2">
          {/* Círculo verde dentro del span del nombre */}
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          {/* Ícono de usuario */}
          <span className="leading-none">👤 {user.name || user.username}</span>
        </span>
      )}

      {/* Botón de cerrar sesión */}
      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
      >
        🔒 Cerrar sesión
      </button>
    </div>
  );
}