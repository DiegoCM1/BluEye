// backend/src/routes/pushToken.routes.js
import { Router } from 'express';
import { registerToken } from '../controllers/pushTokenController.js';

const router = Router();

router.post('/push-token', registerToken);

export default router;
