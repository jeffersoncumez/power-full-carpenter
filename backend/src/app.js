const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const app = express();

// ✅ CORS seguro y flexible (Render + Vercel + desarrollo local)
const allowedOrigins = [
  'http://localhost:5173',                   // desarrollo con Vite
  'http://localhost:4173',                   // preview local
  'https://power-full-carpenter.vercel.app', // dominio principal en Vercel
];

// Middleware de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests sin 'origin' (por ejemplo, herramientas como Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 Bloqueado por CORS: ${origin}`);
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Rutas API
app.use('/api', routes);

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
