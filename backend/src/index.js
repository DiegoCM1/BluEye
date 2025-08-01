// backend/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import riskRoutes from './routes/risk.js';
import alertsRoutes from './routes/alerts.js';
import feedbackRoutes from './routes/feedback.js';
import pushTokenRoutes from './routes/pushToken.routes.js';
import apiKeyAuth from './middleware/apiKeyAuth.js';          // ← import existente

// Inicializa la conexión a la base de datos
import pool from './services/db.js';
import notificationRoutes from './routes/notification.routes.js';
import './services/firebase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/risk', riskRoutes);
app.use('/alerts', alertsRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/api', pushTokenRoutes);

// 🔐 Protegemos todas las rutas /api/notifications/*
app.use('/api/notifications', apiKeyAuth, notificationRoutes); // ← cambio clave

// Health checks …
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'BlueEye backend running',
  });
});

app.get('/health-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1');
    return res.status(200).json({ status: 'OK', db: 'reachable', rows });
  } catch (err) {
    console.error('DB health check failed:', err);
    return res.status(500).json({ status: 'Error', db: 'unreachable' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
