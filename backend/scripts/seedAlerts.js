import 'dotenv/config.js';
import { v4 as uuid } from 'uuid';
import pool from '../src/services/db.js';

const seed = [
  {
    id: uuid(),
    timestamp: new Date('2023-10-25T06:00:00Z'),
    level: 5,
    score: 92,
    title: 'Huracán Otis categoría 5',
    short: 'Vientos 270 km/h y presión 923 hPa',
  },
  {
    id: uuid(),
    timestamp: new Date('2023-10-25T10:00:00Z'),
    level: 4,
    score: 78,
    title: 'Rachas extremas y marejada',
    short: 'Oleaje 8 m en bahía',
  },
  // …agrega dos o tres más
];

for (const a of seed) {
  await pool.query(
    `INSERT INTO alerts (id,timestamp,level,score,title,short)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (id) DO NOTHING`,
    [a.id, a.timestamp, a.level, a.score, a.title, a.short]
  );
}
console.log('✔️ Seed completado');
process.exit(0);
