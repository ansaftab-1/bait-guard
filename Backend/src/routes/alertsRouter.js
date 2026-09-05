import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const alertsRouter = Router();

alertsRouter.use(authenticateUser);

// GET /api/alerts - Viewer, Technician, Admin
alertsRouter.get('/', authorizeRoles('admin', 'technician', 'viewer'), (req, res) => {
  try {
    const alerts = store.getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts', message: err.message });
  }
});

// POST /api/alerts - Technician, Admin
alertsRouter.post('/', authorizeRoles('admin', 'technician'), (req, res) => {
  try {
    const newAlert = store.addAlert(req.body);
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create alert', message: err.message });
  }
});

// PUT /api/alerts/:id/resolve - Technician, Admin
const handleResolve = (req, res) => {
  try {
    const resolved = store.resolveAlert(req.params.id);
    if (!resolved) {
      return res.status(404).json({ error: `Alert "${req.params.id}" not found` });
    }
    res.json({ success: true, alert: resolved });
  } catch (err) {
    res.status(400).json({ error: 'Failed to resolve alert', message: err.message });
  }
};

alertsRouter.put('/:id/resolve', authorizeRoles('admin', 'technician'), handleResolve);
alertsRouter.patch('/:id/resolve', authorizeRoles('admin', 'technician'), handleResolve);
