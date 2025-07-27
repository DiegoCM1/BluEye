// backend/src/services/notification.js

// Usa la instancia ya inicializada en ./firebase.js
import admin from './firebase.js';
import pool from './db.js';

/**
 * Envía una notificación push a todos los tokens almacenados.
 * @param {{ title: string, body: string, data?: Record<string,string> }} payload
 * @returns {Promise<import('firebase-admin').messaging.BatchResponse>}
 */
export async function sendAllNotifications({ title, body, data = {} }) {
  // 1) Recuperar todos los tokens de la BD
  const { rows } = await pool.query('SELECT token FROM device_tokens');
  const tokens = rows.map((r) => r.token).filter(Boolean);
  if (tokens.length === 0) {
    throw new Error('No hay tokens registrados');
  }

  // 2) Construir el mensaje
  const message = {
    notification: { title, body },
    data,
    tokens,
  };

  // 3) Enviar usando la API clásica de Firebase Admin
  const response = await admin.messaging().sendMulticast(message);
  return response;
}
