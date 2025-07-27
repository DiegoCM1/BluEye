// backend/src/routes/pushToken.routes.js

import { Router } from 'express';
import { upsertToken } from '../services/tokenService.js';

const router = Router();

router.post('/push-token', async (req, res) => {
  const { token } = req.body;
  console.log('[push-token] Received token:', token);
  if (!token) {
    console.warn('[push-token] No token in body');
    return res.status(400).json({ error: 'Token missing' });
  }
  try {
    await upsertToken(token);
    console.log('[push-token] Token upsert successful');
    return res.sendStatus(201);
  } catch (err) {
    console.error('[push-token] Error upserting token:', err);
    return res.status(500).json({ error: 'Failed saving token' });
  }
});

export default router;
