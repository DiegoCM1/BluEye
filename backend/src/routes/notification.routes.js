// backend/src/routes/notification.routes.js

import { Router } from 'express';
import { sendAllNotifications } from '../services/notification.js';

const router = Router();

/**
 * POST /api/notifications/send-all
 * Body: { title: string, body: string, data?: Record<string,string> }
 */
router.post('/send-all', async (req, res) => {
  const { title, body, data } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'title and body are required' });
  }
  try {
    const result = await sendAllNotifications({ title, body, data });
    return res.status(200).json({
      successCount: result.successCount,
      failureCount: result.failureCount,
      responses: result.responses,
    });
  } catch (err) {
    console.error('[send-all] Error sending notifications:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
