require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL; // ✅ variable completa de Neon

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL (Neon)');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el cliente de PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
