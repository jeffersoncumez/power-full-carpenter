import { useState, useEffect } from 'react';
import { getInsumos, postMovimiento } from '../../api/inventory';

export default function MovementForm({ onSuccess, onKardexUpdate }) {
  const [insumos, setInsumos] = useState([]);
  const [form, setForm] = useState({
    insumo_id: '',
    tipo: 'ENTRADA',
    cantidad: '',
    pedido_id: '',
    motivo: '',
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getInsumos();
        setInsumos(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 🔹 Timer para desaparecer el toast
  useEffect(() => {
    if (ok) {
      const timer = setTimeout(() => setOk(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [ok]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');
    try {
      await postMovimiento(form);
      setOk('✅ Movimiento registrado con éxito');
      setForm({
        insumo_id: '',
        tipo: 'ENTRADA',
        cantidad: '',
        pedido_id: '',
        motivo: '',
      });

      if (onSuccess) onSuccess();
      if (onKardexUpdate) onKardexUpdate();
    } catch (err) {
      setError(err.response?.data?.error || '❌ Error registrando movimiento');
    }
  };

  return (
    <div className="relative">
      {/* 🔹 Toasts flotantes */}
      {ok && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {ok}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {error}
        </div>
      )}

      <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight">
          ➕ Registrar Movimiento
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Insumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insumo</label>
            <select
              name="insumo_id"
              value={form.insumo_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione...</option>
              {insumos.map((i) => (
                <option key={i.insumo_id} value={i.insumo_id}>
                  {i.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
              <option value="AJUSTE">Ajuste</option>
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              step="0.01"
              value={form.cantidad}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pedido ID (solo SALIDA) */}
          {form.tipo === 'SALIDA' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pedido ID</label>
              <input
                type="number"
                name="pedido_id"
                value={form.pedido_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Motivo (solo AJUSTE) */}
          {form.tipo === 'AJUSTE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <input
                type="text"
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
          >
            Guardar Movimiento
          </button>
        </form>
      </div>
    </div>
  );
}
