const db = require('../services/db');

(async () => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      rating INTEGER NOT NULL,
      email TEXT,
      message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
  } catch (err) {
    console.error('Failed to ensure feedback table:', err);
  }
})();

exports.insert = (feedback, cb) => {
  const { rating, email, message } = feedback;
  db.query(
    'INSERT INTO feedback (rating, email, message) VALUES ($1, $2, $3) RETURNING id',
    [rating, email, message]
  )
    .then((res) => cb && cb(null, res.rows[0].id))
    .catch((err) => cb && cb(err));
};

exports.getAll = (cb) => {
  db.query('SELECT * FROM feedback ORDER BY created_at DESC')
    .then((res) => cb && cb(null, res.rows))
    .catch((err) => cb && cb(err));
};
