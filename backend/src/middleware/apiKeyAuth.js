// backend/src/middleware/apiKeyAuth.js
export default function apiKeyAuth(req, res, next) {
  const expectedKey = process.env.NOTIF_API_KEY;   // ← ahora se lee en runtime
  const apiKey      = req.header('x-api-key');

  if (!expectedKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
