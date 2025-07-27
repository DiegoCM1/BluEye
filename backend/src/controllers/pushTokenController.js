// backend/src/controllers/pushTokenController.js
import { upsertToken } from '../services/tokenService.js';

export async function registerToken(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token required' });

  try {
    await upsertToken(token);
    return res.sendStatus(200);                
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'db error' });
  }
}
