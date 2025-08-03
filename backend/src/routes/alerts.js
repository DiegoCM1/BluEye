// backend/src/routes/alerts.js
import { Router } from 'express';
import pool from '../services/db.js';

const router = Router();

// GET /alerts               → historial paginado
router.get('/', async (req, res) => {
  const limit  = parseInt(req.query.limit)  || 30;
  const offset = parseInt(req.query.offset) || 0;

  const { rows } = await pool.query(
    `SELECT id, timestamp, level, score, title, short
       FROM alerts
      ORDER BY timestamp DESC
      LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  res.json(rows);
});

// GET /alerts/:id           → detalle completo
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'SELECT * FROM alerts WHERE id = $1 LIMIT 1',
    [id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

export default router;
