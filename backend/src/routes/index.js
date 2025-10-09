const express = require('express');
const router = express.Router();

// Importa las rutas individuales
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const pedidosRoutes = require('./orders');
const insumosRoutes = require('./insumos');
const clientesRoutes = require('./clientes');
const incidenciasRoutes = require('./incidencias');
const parametrosRoutes = require('./parametros');
const inventoryRoutes = require('./inventory');
const kanbanRoutes = require('./kanban');
const reportsRoutes = require('./reports');

// Monta las rutas con prefijos
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/insumos', insumosRoutes);
router.use('/clientes', clientesRoutes);
router.use('/incidencias', incidenciasRoutes);
router.use('/parametros', parametrosRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/kanban', kanbanRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;
