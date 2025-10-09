// /frontend/src/pages/OrdersPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../components/orders/OrderForm";
import OrderList from "../components/orders/OrderList";

export default function OrdersPage() {
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const reload = () => setRefresh((prev) => !prev);

  return (
    <div className="p-6 space-y-8">
      {/* 🔹 Encabezado */}
      <div className="flex flex-col items-center relative mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute left-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Ir al Dashboard
        </button>

        <h1 className="text-4xl font-extrabold text-gray-800">
          Gestión de Pedidos
        </h1>
        <p className="text-gray-500 mt-2">
          Crea y administra pedidos activos en el sistema
        </p>
      </div>

      {/* 🔹 Formulario de nuevo pedido */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">

        <OrderForm onOrderCreated={reload} />
      </div>

      {/* 🔹 Listado de pedidos */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">

        <OrderList refresh={refresh} />
      </div>
    </div>
  );
}
