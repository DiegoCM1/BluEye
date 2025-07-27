// backend/src/routes/risk.routes.js

import { Router } from 'express';
import { getRisk } from '../controllers/riskController.js';

const router = Router();

router.post('/', getRisk);

export default router;
