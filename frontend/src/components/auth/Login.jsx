import { useState } from 'react';
import { login as apiLogin } from '../../api/auth';
import { useAppContext } from '../../contexts/AppContext';
import useRedirectByRole from '../../hooks/useRedirectByRole';
import logoCarpinteria from '../../images/logo-carpinteria.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const redirectByRole = useRedirectByRole();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Completa ambos campos');
      return;
    }
    try {
      const data = await apiLogin({ email, password });
      login(data);
      redirectByRole(data.role);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      {/* 🔹 Título principal */}
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8 tracking-tight">
        Bienvenido a <span className="text-blue-600">Power Full Carpenter</span>
      </h1>

      {/* Caja blanca */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center border border-gray-100">
        {/* Logo */}
        <img
          src={logoCarpinteria}
          alt="Logo Power Full Carpenter"
          className="h-90 w-auto mb-6 drop-shadow-sm"
        />

        {/* Subtítulo */}
        <p className="text-gray-600 text-center mb-6">
          Inicia sesión para comenzar tu jornada de trabajo
        </p>

        {/* Mensaje de error */}
        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded mb-4 w-full text-center">
            {error}
          </p>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="grid gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-3 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
