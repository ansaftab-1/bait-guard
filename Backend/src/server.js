import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { broadcastEngine } from './ws/broadcast.js';
import { stationsRouter } from './routes/stationsRouter.js';
import { alertsRouter } from './routes/alertsRouter.js';
import { overviewRouter } from './routes/overviewRouter.js';
import { mapRouter } from './routes/mapRouter.js';
import { reportsRouter } from './routes/reportsRouter.js';
import { settingsRouter } from './routes/settingsRouter.js';
import { usersRouter } from './routes/usersRouter.js';
import { accessRequestsRouter } from './routes/accessRequestsRouter.js';
import { roleRequestsRouter } from './routes/roleRequestsRouter.js';
import { auditLogsRouter } from './routes/auditLogsRouter.js';
import { authRouter } from './routes/authRouter.js';
import { adminNotificationRouter } from './routes/adminNotificationRouter.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Security & utility middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
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

// Mount modular API routers
app.use('/api/stations', stationsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/overview', overviewRouter);
app.use('/api/facility-map', mapRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/access-requests', accessRequestsRouter);
app.use('/api/role-requests', roleRequestsRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminNotificationRouter);

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Centralized error handler
app.use((err, req, res, _next) => {
  console.error('[Error Handler]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Initialize WebSocket broadcast engine on the HTTP server
broadcastEngine.init(server);

// Start server
server.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 Bait Guard Backend Engine is LIVE`);
  console.log(`📡 HTTP REST API: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket Server: ws://localhost:${PORT}/ws`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[Server] Received SIGTERM. Shutting down gracefully...');
  broadcastEngine.stop();
  server.close(() => {
    console.log('[Server] HTTP and WS closed.');
    process.exit(0);
  });
});
