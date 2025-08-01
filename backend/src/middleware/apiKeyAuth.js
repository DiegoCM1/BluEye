// backend/src/middleware/apiKeyAuth.js
const EXPECTED_KEY = process.env.NOTIF_API_KEY; // ya está en process.env

export default function apiKeyAuth(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!EXPECTED_KEY || apiKey !== EXPECTED_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
