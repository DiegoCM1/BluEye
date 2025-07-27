// src/services/db.js
const { Pool } = require('pg');

// Inicializa un pool de conexiones usando la URL de conexión de env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // si tu DATABASE_URL lleva sslmode=require, podrías omitir esta sección,
  // pero explicítalo para entornos que requieran verificación:
  ssl: {
    rejectUnauthorized: false
  }
});

// Opcional: escucha errores del pool para logging
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;
