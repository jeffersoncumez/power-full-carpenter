require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'powerfull_carpenter',
  max: 10
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});

module.exports = pool;