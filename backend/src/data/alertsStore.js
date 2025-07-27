// backend/src/data/alertsStore.js

const alerts = [];

export function add(alert) {
  alerts.push(alert);
  return alert;
}

export function getAll() {
  return alerts;
}

export function getById(id) {
  return alerts.find((a) => a.id === id);
}
