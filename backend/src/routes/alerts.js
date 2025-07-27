// backend/src/routes/alerts.routes.js

import { Router } from 'express';
import { listAlerts, getAlert } from '../controllers/alertsController.js';

const router = Router();

router.get('/', listAlerts);
router.get('/:id', getAlert);

export default router;
