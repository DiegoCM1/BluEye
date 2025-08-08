import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import router from '../src/routes/alerts.js';
import pool from '../src/services/db.js';

function createApp() {
  const app = express();
  app.use('/alerts', router);
  return app;
}

test('GET /alerts success', async (t) => {
  const app = createApp();
  const mockRows = [{ id: 1 }];
  const original = pool.query;
  pool.query = async () => ({ rows: mockRows });
  t.after(() => {
    pool.query = original;
  });

  const res = await request(app).get('/alerts');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, mockRows);
});

test('GET /alerts failure', async (t) => {
  const app = createApp();
  const original = pool.query;
  pool.query = async () => { throw new Error('db'); };
  t.after(() => {
    pool.query = original;
  });

  const res = await request(app).get('/alerts');
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { error: 'Internal server error' });
});

test('GET /alerts/:id success', async (t) => {
  const app = createApp();
  const mockRows = [{ id: 1, data: 'test' }];
  const original = pool.query;
  pool.query = async () => ({ rows: mockRows });
  t.after(() => {
    pool.query = original;
  });

  const res = await request(app).get('/alerts/1');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, mockRows[0]);
});

test('GET /alerts/:id failure', async (t) => {
  const app = createApp();
  const original = pool.query;
  pool.query = async () => { throw new Error('db'); };
  t.after(() => {
    pool.query = original;
  });

  const res = await request(app).get('/alerts/1');
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { error: 'Internal server error' });
});
