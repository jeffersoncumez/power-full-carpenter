import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/layout/Navbar';

import DashboardHome from './pages/DashboardHome';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import KanbanBoard from './components/kanban/KanbanBoard';

import IncidenciasList from './components/inventory/IncidenciasList';
import Login from './components/auth/Login';
import { useAppContext } from './contexts/AppContext';
import PrivateRoute from './components/auth/PrivateRoute';

// ✨ Importa el nuevo componente de página
import ParametrosPage from "./pages/ParametrosPage";
import ReportsPage from "./pages/ReportsPage";
import ClientesPage from "./pages/ClientesPage";

function App() {
  const { user } = useAppContext();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {user && <Navbar />}

        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Supervisor */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['Supervisor']}>
                  <DashboardHome />
                </PrivateRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <PrivateRoute allowedRoles={['Supervisor']}>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reportes"
              element={
                <PrivateRoute allowedRoles={['Supervisor']}>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/incidencias"
              element={
                <PrivateRoute allowedRoles={['Supervisor']}>
                  <IncidenciasList />
                </PrivateRoute>
              }
            />

            {/* ✨ Agrega la nueva ruta para la página de parámetros */}
            <Route
              path="/parametros"
              element={
                <PrivateRoute allowedRoles={['Supervisor']}>
                  <ParametrosPage />
                </PrivateRoute>
              }
            />

            // Dentro de tus rutas:
            <Route 
              path="/clientes" 
              element={
              <PrivateRoute allowedRoles={['Supervisor']}>
                <ClientesPage />
              </PrivateRoute>
              } 
            />

            {/* Inventario */}
            <Route
              path="/inventario"
              element={
                <PrivateRoute allowedRoles={['Inventario', 'Supervisor']}>
                  <InventoryPage />
                </PrivateRoute>
              }
            />

            {/* Operario */}
            <Route
              path="/kanban"
              element={
                <PrivateRoute allowedRoles={['Operario', 'Supervisor']}>
                  <KanbanBoard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
