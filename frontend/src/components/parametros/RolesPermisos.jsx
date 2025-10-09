import { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  updateUserRole,
  deleteUser,
  toggleUserActive,
} from "../../api/users";

export default function RolesPermisos() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const loadData = async () => {
    const data = await getUsers();
    setUsuarios(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditando(user.user_id);
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setEditando(null);
      setForm({ name: "", email: "", password: "", role: "" });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (editando) {
      await updateUserRole(editando, form.role);
    } else {
      await addUser(form);
    }
    setShowModal(false);
    loadData();
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowConfirmModal(false);
    try {
      await deleteUser(userIdToDelete);
      loadData();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      if (error.response && error.response.status === 500) {
        setErrorMessage(
          "No se puede eliminar porque el usuario tiene movimientos registrados en el sistema."
        );
        setShowErrorModal(true);
      } else {
        setErrorMessage(
          "Ocurrió un error inesperado al eliminar el usuario."
        );
        setShowErrorModal(true);
      }
    }
  };

  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
        <h3 className="text-lg font-bold text-red-600 mb-3">⚠️ Error</h3>
        <p className="text-gray-700 mb-4">{errorMessage}</p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowErrorModal(false)}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Confirmar Eliminación</h3>
        <p className="text-gray-700 mb-4">¿Estás seguro de que quieres eliminar a este usuario? Esta acción es irreversible.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-4">👥 Roles de Usuario</h3>

      <button
        onClick={() => handleOpenModal()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
      >
        ➕ Agregar Usuario
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-3 py-2 text-left">Usuario</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-center">Rol</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, idx) => (
              <tr
                key={u.user_id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="border px-3 py-2">{u.name}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2 text-center">{u.role}</td>
                <td className="border px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(u)}
                    className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded hover:bg-yellow-200 transition"
                  >
                    ✏️ Rol
                  </button>
                  <button
                    onClick={() => handleDeleteClick(u.user_id)}
                    className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-200 transition"
                  >
                    🗑️ Eliminar
                  </button>
                  <button
                    onClick={async () => {
                      await toggleUserActive(u.user_id, !u.activo);
                      loadData();
                    }}
                    className={`${
                      u.activo
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white px-3 py-1 rounded transition`}
                  >
                    {u.activo ? "🔒 Inhabilitar" : "✅ Habilitar"}
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] animate-fade-in-down">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {editando ? "✏️ Editar Usuario" : "➕ Agregar Usuario"}
            </h3>

            <div className="space-y-3">
              {!editando && (
                <>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Correo"
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Selecciona Rol --</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Inventario">Inventario</option>
                <option value="Operario">Operario</option>
              </select>
            </div>

            <div className="flex justify-end mt-5 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {editando ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && <ErrorModal />}
      {showConfirmModal && <DeleteConfirmationModal />}
    </div>
  );
}