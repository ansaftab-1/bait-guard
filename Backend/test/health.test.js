import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BaitGuard Backend Engine',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

async function request(path) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      http.get(`http://127.0.0.1:${port}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          server.close();
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        });
      }).on('error', (err) => {
        server.close();
        reject(err);
      });
    });
  });
}

test('Health Check - GET /health returns 200 and uptime', async () => {
  const res = await request('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.ok(typeof res.body.uptime === 'number');
  assert.ok(res.body.timestamp);
});

test('Health Check - GET /api/health returns detailed diagnostics', async () => {
  const res = await request('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.service, 'BaitGuard Backend Engine');
  assert.equal(res.body.version, '1.0.0');
  assert.ok(typeof res.body.uptime === 'number');
  assert.ok(res.body.memory);
  assert.ok(res.body.timestamp);
});
