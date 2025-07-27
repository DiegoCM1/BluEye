// backend/src/controllers/risk.controller.js

import { fetchRiskData } from '../services/openWeather.js';

export async function getRisk(req, res) {
  try {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const data = await fetchRiskData(lat, lon);
    res.json(data);
  } catch (err) {
    console.error('Risk controller error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
