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

    // 3) Enviar usando la API moderna de Firebase Admin
    // Desde firebase-admin v13, el método se llama `sendEachForMulticast`
    // y reemplaza al antiguo `sendMulticast`.
    const response = await admin.messaging().sendEachForMulticast(message);

    // Limpia tokens que fallaron
    const invalidTokens = response.responses
        .map((r, i) => (!r.success ? tokens[i] : null))
        .filter(Boolean);

    if (invalidTokens.length) {
        await pool.query(
            'DELETE FROM device_tokens WHERE token = ANY($1::text[])',
            [invalidTokens]
        );
    }

    return response;
}
