import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';

import { store } from '../src/db/store.js';
import { authRouter } from '../src/routes/authRouter.js';
import { usersRouter } from '../src/routes/usersRouter.js';
import { roleRequestsRouter } from '../src/routes/roleRequestsRouter.js';
import { stationsRouter } from '../src/routes/stationsRouter.js';
import { alertsRouter } from '../src/routes/alertsRouter.js';
import { auditLogsRouter } from '../src/routes/auditLogsRouter.js';

// Setup isolated Express test application
const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/role-requests', roleRequestsRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/audit-logs', auditLogsRouter);

// Helper to make HTTP requests against the test app
async function request(method, url, { body, token } = {}) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: url,
          method,
          headers,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            server.close();
            let parsed = null;
            try {
              parsed = data ? JSON.parse(data) : null;
            } catch {
              parsed = data;
            }
            resolve({ status: res.statusCode, body: parsed });
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
}

// Global test variables
let testViewer = null;
let testTech = null;
let testAdmin = null;

let viewerToken = null;
let techToken = null;
let adminToken = null;
let submittedRequestId = null;

test('0. Setup dedicated test users in store', () => {
  testViewer = store.addUser({
    name: 'Alice Viewer',
    email: `alice_${Date.now()}@example.com`,
    password: 'password123',
    role: 'viewer',
  });

  testTech = store.addUser({
    name: 'Bob Tech',
    email: `bob_${Date.now()}@example.com`,
    password: 'password123',
    role: 'technician',
  });

  testAdmin = store.addUser({
    name: 'Charlie Admin',
    email: `charlie_${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin',
  });

  assert.ok(testViewer.id);
  assert.ok(testTech.id);
  assert.ok(testAdmin.id);
});

// 1. Authentication
test('1.1. Viewer login returns JWT token and viewer role', async () => {
  const res = await request('POST', '/api/auth/login', {
    body: { email: testViewer.email, password: 'password123' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.role, 'viewer');
  assert.ok(res.body.token);
  viewerToken = res.body.token;
});

test('1.2. Technician login returns JWT token and technician role', async () => {
  const res = await request('POST', '/api/auth/login', {
    body: { email: testTech.email, password: 'password123' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.role, 'technician');
  assert.ok(res.body.token);
  techToken = res.body.token;
});

test('1.3. Admin login returns JWT token and admin role', async () => {
  const res = await request('POST', '/api/auth/login', {
    body: { email: testAdmin.email, password: 'password123' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.role, 'admin');
  assert.ok(res.body.token);
  adminToken = res.body.token;
});

test('1.4. Invalid credentials rejected with 401', async () => {
  const res = await request('POST', '/api/auth/login', {
    body: { email: testViewer.email, password: 'wrongpassword' },
  });
  assert.equal(res.status, 401);
});

test('1.5. GET /api/auth/me returns current user profile loaded directly from database', async () => {
  const res = await request('GET', '/api/auth/me', { token: viewerToken });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, testViewer.email);
  assert.equal(res.body.user.role, 'viewer');
});

// 2. Authorization Role Enforcement
test('2.1. Viewer CANNOT create stations (Technician/Admin only) -> 403 Forbidden', async () => {
  const res = await request('POST', '/api/stations', {
    token: viewerToken,
    body: { code: 'RB-TEST-V1', facility: 'Warehouse A' },
  });
  assert.equal(res.status, 403);
  assert.equal(res.body.error, 'Forbidden');
});

test('2.2. Viewer CANNOT access user management (Admin only) -> 403 Forbidden', async () => {
  const res = await request('GET', '/api/users', { token: viewerToken });
  assert.equal(res.status, 403);
  assert.equal(res.body.error, 'Forbidden');
});

test('2.3. Viewer CANNOT modify user roles -> 403 Forbidden', async () => {
  const res = await request('PATCH', `/api/users/${testViewer.id}/role`, {
    token: viewerToken,
    body: { role: 'admin' },
  });
  assert.equal(res.status, 403);
});

test('2.4. Technician CAN create station -> 201 Created', async () => {
  const res = await request('POST', '/api/stations', {
    token: techToken,
    body: { code: 'RB-TECH-01', facility: 'Warehouse A', bait: 95 },
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.code, 'RB-TECH-01');
});

test('2.5. Technician CANNOT access user management (Admin only) -> 403 Forbidden', async () => {
  const res = await request('GET', '/api/users', { token: techToken });
  assert.equal(res.status, 403);
  assert.equal(res.body.error, 'Forbidden');
});

test('2.6. Technician CANNOT change user roles -> 403 Forbidden', async () => {
  const res = await request('PATCH', `/api/users/${testViewer.id}/role`, {
    token: techToken,
    body: { role: 'technician' },
  });
  assert.equal(res.status, 403);
});

test('2.7. Admin CAN access user management -> 200 OK', async () => {
  const res = await request('GET', '/api/users', { token: adminToken });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});

// 3. Admin Direct Role Change & Stale JWT Role Protection
test('3.1. Admin changes user role from viewer to technician via PATCH /api/users/:id/role', async () => {
  const res = await request('PATCH', `/api/users/${testViewer.id}/role`, {
    token: adminToken,
    body: { role: 'technician', reason: 'Assigned to field maintenance' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.role, 'technician');

  // Verify database source of truth
  const inDb = store.getUserById(testViewer.id);
  assert.equal(inDb.role, 'technician');
});

test('3.2. Stale Token Test: Old viewer token now successfully accesses technician APIs because database is the source of truth', async () => {
  // Note: viewerToken was minted when user was a "viewer".
  // Because authenticateUser loads the live user from the database, authorization reflects "technician" immediately!
  const res = await request('POST', '/api/stations', {
    token: viewerToken,
    body: { code: 'RB-STALE-01', facility: 'Warehouse B', bait: 80 },
  });
  assert.equal(res.status, 201);
});

test('3.3. Admin demotes user back to viewer', async () => {
  const res = await request('PATCH', `/api/users/${testViewer.id}/role`, {
    token: adminToken,
    body: { role: 'viewer', reason: 'Reverting promotion' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.role, 'viewer');
});

test('3.4. Stale Token Revocation: That same token is now immediately blocked from technician endpoints -> 403 Forbidden', async () => {
  const res = await request('POST', '/api/stations', {
    token: viewerToken,
    body: { code: 'RB-BLOCKED-01', facility: 'Warehouse A' },
  });
  assert.equal(res.status, 403);
  assert.equal(res.body.error, 'Forbidden');
});

// 4. Role Request Workflow (Submission, Duplicate Prevention, Approval, Rejection)
test('4.1. User submits role request for technician -> 201 Created (status: pending)', async () => {
  const res = await request('POST', '/api/role-requests', {
    token: viewerToken,
    body: {
      requestedRole: 'technician',
      facility: 'Warehouse B',
      message: 'Completed technician certification',
    },
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.request.status, 'pending');
  assert.equal(res.body.request.requestedRole, 'technician');
  submittedRequestId = res.body.request.id;

  // User remains viewer until approval
  const inDb = store.getUserById(testViewer.id);
  assert.equal(inDb.role, 'viewer');
});

test('4.2. Duplicate pending request is rejected with 409 Conflict', async () => {
  const res = await request('POST', '/api/role-requests', {
    token: viewerToken,
    body: {
      requestedRole: 'technician',
      facility: 'Warehouse B',
    },
  });
  assert.equal(res.status, 409);
  assert.match(res.body.message, /already awaiting review/);
});

test('4.3. Non-admin CANNOT approve role request -> 403 Forbidden', async () => {
  const res = await request('PATCH', `/api/role-requests/${submittedRequestId}/approve`, {
    token: techToken,
  });
  assert.equal(res.status, 403);
});

test('4.4. Admin approves role request -> status approved and database role updated to technician', async () => {
  const res = await request('PATCH', `/api/role-requests/${submittedRequestId}/approve`, {
    token: adminToken,
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.request.status, 'approved');
  assert.equal(res.body.user.role, 'technician');

  // Verify database source of truth
  const inDb = store.getUserById(testViewer.id);
  assert.equal(inDb.role, 'technician');
});

test('4.5. User requests admin role, then admin rejects -> status rejected and role unchanged', async () => {
  const submitRes = await request('POST', '/api/role-requests', {
    token: viewerToken,
    body: {
      requestedRole: 'admin',
      facility: 'Distribution Center',
      message: 'Requesting admin governance',
    },
  });
  assert.equal(submitRes.status, 201);
  const adminReqId = submitRes.body.request.id;

  // Admin rejects request
  const rejectRes = await request('PATCH', `/api/role-requests/${adminReqId}/reject`, {
    token: adminToken,
    body: { reason: 'Requires management authorization' },
  });
  assert.equal(rejectRes.status, 200);
  assert.equal(rejectRes.body.request.status, 'rejected');

  // Role remains technician
  const inDb = store.getUserById(testViewer.id);
  assert.equal(inDb.role, 'technician');
});

// 5. Audit Logging
test('5.1. Admin can fetch audit logs recording all role changes and approvals', async () => {
  const res = await request('GET', '/api/audit-logs', { token: adminToken });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 3);

  const roleChangeLog = res.body.find((l) => l.action === 'USER_ROLE_CHANGED');
  assert.ok(roleChangeLog);
  assert.equal(roleChangeLog.targetUserEmail, testViewer.email);

  const approvalLog = res.body.find((l) => l.action === 'ROLE_REQUEST_APPROVED');
  assert.ok(approvalLog);
  assert.equal(approvalLog.targetUserEmail, testViewer.email);
});

test('5.2. Non-admin CANNOT view audit logs -> 403 Forbidden', async () => {
  const res = await request('GET', '/api/audit-logs', { token: techToken });
  assert.equal(res.status, 403);
});
