// backend/src/db.js
require('dotenv').config();
const { Pool } = require('pg');

// 💡 ¡CRUCIAL! Usar la cadena de conexión completa de Neon.
// Render debe tener esta variable definida: DATABASE_URL
const connectionString = process.env.DATABASE_URL; 

const pool = new Pool({
  connectionString, // Usa la variable completa en lugar de host/user/password
  ssl: {
    rejectUnauthorized: false // Necesario para Neon/Render
  }
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL (Neon)');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente de PostgreSQL:', err);
  // No queremos que el servidor se caiga si hay un error temporal,
  // pero mantén el log para depurar.
});

module.exports = pool;