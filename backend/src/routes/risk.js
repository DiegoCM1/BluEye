// backend/src/routes/risk.routes.js

import { Router } from 'express';
import { getRisk } from '../controllers/risk.controller.js';

const router = Router();

router.post('/', getRisk);

export default router;
