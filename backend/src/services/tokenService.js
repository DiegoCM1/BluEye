// backend/src/services/tokenService.js

import pool from '../data/db.js';  // tu instancia de pg.Pool

export async function upsertToken(token) {
  const query = `
    INSERT INTO device_tokens (token)
    VALUES ($1)
    ON CONFLICT (token)
    DO UPDATE SET updated_at = NOW()
  `;
  await pool.query(query, [token]);
}
