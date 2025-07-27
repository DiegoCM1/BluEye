// backend/src/controllers/alerts.controller.js

// Import the alert store functions directly as there is no default export
import * as alertsStore from '../data/alertsStore.js';

export function listAlerts(req, res) {
  res.json(alertsStore.getAll());
}

export function getAlert(req, res) {
  const alert = alertsStore.getById(req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
}
