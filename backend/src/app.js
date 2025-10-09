const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

// Reemplaza con la URL de tu frontend en Vercel
app.use(cors({ origin: 'https://power-full-carpenter.vercel.app' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api', routes);

// manejador de errores simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
