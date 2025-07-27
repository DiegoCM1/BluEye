// src/data/feedbackStore.js
const pool = require('../services/db');

// Si quieres mantener la creación automática de la tabla, déjalo:
;(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.feedback (
        id SERIAL PRIMARY KEY,
        rating INTEGER NOT NULL,
        email TEXT,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (err) {
    console.error('Failed to ensure feedback table:', err);
  }
})();

// Inserta un nuevo feedback y devuelve el ID
async function createFeedback({ rating, email, message }) {
  const result = await pool.query(
    `INSERT INTO public.feedback (rating, email, message)
     VALUES ($1, $2, $3)
     RETURNING id;`,
    [rating, email, message]
  );
  return result.rows[0].id;
}

// Recupera todos los feedbacks
async function getAllFeedback() {
  const result = await pool.query(
    `SELECT id, rating, email, message, created_at
     FROM public.feedback
     ORDER BY created_at DESC;`
  );
  return result.rows;
}

module.exports = {
  createFeedback,
  getAllFeedback,
};
