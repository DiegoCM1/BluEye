// backend/src/routes/alerts.js
import { Router } from 'express';
import pool from '../services/db.js';

const router = Router();

// GET /alerts               → historial paginado
router.get('/', async (req, res) => {
  const limit  = parseInt(req.query.limit)  || 30;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const { rows } = await pool.query(
      `SELECT id, timestamp, level, score, title, short
       FROM alerts
      ORDER BY timestamp DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching alerts', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /alerts/:id           → detalle completo
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM alerts WHERE id = $1 LIMIT 1',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching alert', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
