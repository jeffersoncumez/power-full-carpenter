const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

// ✅ Permite llamadas desde Vercel
app.use(cors({
  origin: ['https://power-full-carpenter.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Rutas API
app.use('/api', routes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
