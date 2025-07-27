// backend/src/routes/feedback.js

import { Router } from 'express';
// Use the handler names exported by the controller
import { createFeedbackHandler, getAllFeedbackHandler } from '../controllers/feedbackController.js';

const router = Router();

// POST /feedback → crea un nuevo feedback
router.post('/', createFeedbackHandler);

// GET  /feedback → lista todos los feedbacks
router.get('/', getAllFeedbackHandler);

export default router;
