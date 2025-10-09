import { useState, useEffect } from 'react';
import { createOrder } from '../../api/orders';
import { getOperarios } from '../../api/users';
import { getParametros } from '../../api/parametros';
import { getClientes, addCliente } from '../../api/clientes'; // 👈 integración clientes

export default function OrderForm({ onOrderCreated }) {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');

  const [showNuevoCliente, setShowNuevoCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    direccion: ''
  });

  const [prioridad, setPrioridad] = useState('Normal');
  const [descripcion, setDescripcion] = useState('');
  const [area, setArea] = useState('');
  const [asignadoA, setAsignadoA] = useState('');
  const [fechaCompromiso, setFechaCompromiso] = useState('');
  const [operarios, setOperarios] = useState([]);
  const [paramAreas, setParamAreas] = useState([]);
  const [paramPrioridades, setParamPrioridades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ops = await getOperarios();
        setOperarios(ops);

        const areas = await getParametros('area');
        setParamAreas(areas);

        const prioridades = await getParametros('prioridad');
        setParamPrioridades(prioridades);

        const cls = await getClientes();
        setClientes(cls);
      } catch (e) {
        console.error('Error cargando datos dinámicos', e);
      }
    })();
  }, []);

  const handleCrearCliente = async () => {
    if (!nuevoCliente.nombre.trim()) return alert("El nombre es obligatorio");

    try {
      const cliente = await addCliente(nuevoCliente);
      setClienteId(cliente.cliente_id);
      setNombreCliente(cliente.nombre);
      setNuevoCliente({ nombre: '', telefono: '', correo: '', direccion: '' });
      setShowNuevoCliente(false);
      setClientes(await getClientes()); // refrescar lista
    } catch (err) {
      alert(err.response?.data?.error || "Error registrando cliente");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!asignadoA) return setError('Debes asignar un operario');
    if (!area) return setError('Debes seleccionar un área');

    try {
      await createOrder({
        cliente_id: clienteId || null,
        nombre_cliente: nombreCliente || clientes.find(c => c.cliente_id === Number(clienteId))?.nombre || '',
        area,
        prioridad,
        descripcion,
        asignado_a: Number(asignadoA),
        fecha_compromiso: fechaCompromiso || null,
      });

      // Reset
      setClienteId('');
      setNombreCliente('');
      setPrioridad('Normal');
      setDescripcion('');
      setArea('');
      setAsignadoA('');
      setFechaCompromiso('');
      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error creando pedido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-5 border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-2">📋 Nuevo Pedido</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Cliente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
        <select
          value={clienteId}
          onChange={(e) => {
            setClienteId(e.target.value);
            setNombreCliente('');
          }}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona un cliente...</option>
          {clientes.map((c) => (
            <option key={c.cliente_id} value={c.cliente_id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="mt-2 text-blue-600 hover:underline text-sm"
          onClick={() => setShowNuevoCliente(true)}
        >
          ➕ Nuevo Cliente
        </button>
      </div>

      {/* Modal Nuevo Cliente */}
      {showNuevoCliente && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="font-semibold mb-3">➕ Registrar Cliente</h3>

            <input
              value={nuevoCliente.nombre}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Nombre del cliente"
            />
            <input
              value={nuevoCliente.telefono}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Teléfono"
            />
            <input
              value={nuevoCliente.correo}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Correo electrónico"
              type="email"
            />
            <textarea
              value={nuevoCliente.direccion}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Dirección"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button type="button" onClick={() => setShowNuevoCliente(false)} className="px-3 py-1 border rounded">
                Cancelar
              </button>
              <button type="button" onClick={handleCrearCliente} className="px-3 py-1 bg-blue-600 text-white rounded">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del pedido
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          placeholder="Ejemplo: Fabricación de mesa vintage..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha compromiso */}
      <div>
        <label htmlFor="fechaCompromiso" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Compromiso
        </label>
        <input
          id="fechaCompromiso"
          name="fechaCompromiso"
          type="date"
          value={fechaCompromiso}
          onChange={(e) => setFechaCompromiso(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Prioridad */}
      <div>
        <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
          Prioridad
        </label>
        <select
          id="prioridad"
          name="prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          {paramPrioridades.map((p, idx) => (
            <option key={idx} value={p.valor}>
              {p.valor}
            </option>
          ))}
        </select>
      </div>

      {/* Área */}
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
          Área
        </label>
        <select
          id="area"
          name="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Selecciona un área</option>
          {paramAreas.map((a, idx) => (
            <option key={idx} value={a.valor}>
              {a.valor}
            </option>
          ))}
        </select>
      </div>

      {/* Operario */}
      <div>
        <label htmlFor="asignadoA" className="block text-sm font-medium text-gray-700 mb-1">
          Operario Asignado
        </label>
        <select
          id="asignadoA"
          name="asignadoA"
          value={asignadoA}
          onChange={(e) => setAsignadoA(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Selecciona un operario</option>
          {operarios.map((o) => (
            <option key={o.user_id} value={o.user_id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          ➕ Crear Pedido
        </button>
      </div>
    </form>
  );
}
