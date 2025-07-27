// backend/src/services/notification.js

import admin from './firebase.js';
import pool from './db.js';
// Importa la función modular
import { getMessaging } from 'firebase-admin/messaging';

export async function sendAllNotifications({ title, body, data = {} }) {
  // 1) Recuperar todos los tokens
  const { rows } = await pool.query('SELECT token FROM device_tokens');
  const tokens = rows.map(r => r.token).filter(Boolean);
  if (tokens.length === 0) {
    throw new Error('No hay tokens registrados');
  }

  // 2) Construir el mensaje
  const message = {
    notification: { title, body },
    data,
    tokens,
  };

  // 3) Obtén la instancia de Messaging y envía el multicast
  const messaging = getMessaging(admin);
  const response = await messaging.sendMulticast(message);

  return response;
}
