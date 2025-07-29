#!/usr/bin/env node
/**
 * Job: obtiene clima, calcula riesgo y, si sube de nivel, envía notificación
 * Ejecútalo con:  node tasks/checkRisk.js
 * Variables necesarias: DATABASE_URL, OPENWEATHER_API_KEY, FIREBASE_SERVICE_ACCOUNT_KEY
 */

import 'dotenv/config.js';
import { v4 as uuid } from 'uuid';
import pool from '../src/services/db.js';
import { fetchRiskData } from '../src/services/openWeather.js';
import { sendAllNotifications } from '../src/services/notification.js';

const LAT = 16.853;   // Acapulco
const LON = -99.823;

async function checkRisk() {
  // 1) Obtener datos de clima y puntaje
  const risk = await fetchRiskData(LAT, LON);
  const { riskScore: score, riskLevel: level, factors, recommendations } = risk;

  if (score <= 30) {
    console.log('[checkRisk] Score', score, '→ sin alerta');
    return;
  }

  // 2) Leer último nivel guardado para esta ubicación
  const { rows } = await pool.query(
    'SELECT level FROM alerts WHERE lat=$1 AND lon=$2 ORDER BY timestamp DESC LIMIT 1',
    [LAT, LON]
  );
  const lastLevel = rows[0]?.level ?? 0;

  if (level <= lastLevel) {
    console.log('[checkRisk] Nivel', level, 'no supera el previo', lastLevel);
    return; // Sin cambio significativo
  }

  // 3) Crear alerta
  const id = uuid();
  const alert = {
    id,
    timestamp: new Date(),
    lat: LAT,
    lon: LON,
    score,
    level,
    factors,
    recommendations,
  };

  // 4) Guardar en la base
  await pool.query(
    `INSERT INTO alerts (id,timestamp,lat,lon,score,level,factors,recommendations)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      alert.id,
      alert.timestamp,
      alert.lat,
      alert.lon,
      alert.score,
      alert.level,
      JSON.stringify(factors),
      JSON.stringify(recommendations),
    ]
  );

  // 5) Enviar notificación
  const title = level >= 4 ? '🚨 ¡Alerta roja de huracán!' : '⚠️ Alerta meteorológica';
  const body = `Nivel ${level} – vientos y lluvia intensos.`;
  await sendAllNotifications({
    title,
    body,
    data: { alertId: id, alertLevel: level },
  });

  console.log('[checkRisk] Nueva alerta nivel', level, 'enviada ✔️');
}

checkRisk()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[checkRisk] Error:', err);
    process.exit(1);
  });


// Descarga clima actual y pronóstico → obtiene score y level.

// Compara con el último nivel guardado para evitar spam.

// Guarda la alerta (ID UUID) en la tabla alerts.

// Envía push con alertId y alertLevel (para que la app decida la pantalla).

// Sale con código 0 si todo fue OK (Railway Cron lo marca como éxito).