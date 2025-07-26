const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const riskRoutes = require('./routes/risk');
const alertsRoutes = require('./routes/alerts');
const feedbackRoutes = require('./routes/feedback');

// Initialize database
require('./services/db');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/risk', riskRoutes);
app.use('/alerts', alertsRoutes);
app.use('/feedback', feedbackRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'BlueEye backend running'
  });
});

// Health check: comprueba que el servidor responde y la DB está accesible
app.get('/health', async (req, res) => {
  try {
    // Si usas pg.Pool:
    await pool.query('SELECT 1');
    return res.status(200).json({ status: 'OK', db: 'reachable' });
  } catch (err) {
    console.error('DB health check failed:', err);
    return res.status(500).json({ status: 'Error', db: 'unreachable' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
