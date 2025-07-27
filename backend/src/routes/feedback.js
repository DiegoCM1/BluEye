// backend/src/routes/feedback.js

import { Router } from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController.js';

const router = Router();

// POST /feedback → crea un nuevo feedback
router.post('/', createFeedback);

// GET  /feedback → lista todos los feedbacks
router.get('/', getAllFeedback);

export default router;
