// backend/src/controllers/feedback.controller.js

import { createFeedback, getAllFeedback } from '../data/feedbackStore.js';

/**
 * POST /feedback
 * Body: { rating, email?, message }
 */
export async function createFeedbackHandler(req, res) {
  console.log('BODY RECEIVED:', req.body);
  const { rating, email, message } = req.body;

  // Validaciones básicas
  if (typeof rating !== 'number') {
    return res.status(400).json({ error: 'rating es obligatorio y debe ser number' });
  }
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message es obligatorio y debe ser texto' });
  }

  try {
    const id = await createFeedback({ rating, email, message });
    return res.status(201).json({ id });
  } catch (err) {
    console.error('Error al crear feedback:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * GET /feedback
 * Query: —
 */
export async function getAllFeedbackHandler(req, res) {
  try {
    const all = await getAllFeedback();
    return res.status(200).json(all);
  } catch (err) {
    console.error('Error al recuperar feedback:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
