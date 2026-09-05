import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const auditLogsRouter = Router();

// GET /api/audit-logs - Admin only
auditLogsRouter.get('/', authenticateUser, authorizeRoles('admin'), (req, res) => {
  try {
    const logs = store.getAuditLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs', message: err.message });
  }
});
