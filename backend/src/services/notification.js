// backend/src/services/notification.js

import admin from './firebase.js';
import pool from './db.js';

/**
 * Envía una notificación a todos los tokens registrados.
 */
export async function sendAllNotifications({ title, body, data = {} }) {
  const { rows } = await pool.query('SELECT token FROM device_tokens');
  const tokens = rows.map(r => r.token).filter(Boolean);
  if (tokens.length === 0) {
    throw new Error('No hay tokens registrados');
  }

  const message = {
    notification: { title, body },
    data,
    tokens,
  };

  // Ahora usamos la instancia inicializada
  const response = await admin.messaging().sendMulticast(message);
  return response;
}
