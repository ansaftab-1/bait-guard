import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const settingsRouter = Router();

settingsRouter.use(authenticateUser);

// GET /api/settings - Viewer, Technician, Admin
settingsRouter.get('/', authorizeRoles('admin', 'technician', 'viewer'), (req, res) => {
  try {
    const settings = store.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings', message: err.message });
  }
});

// PUT /api/settings - Strictly restricted to Admin
const handleUpdateSettings = (req, res) => {
  try {
    const updated = store.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update settings', message: err.message });
  }
};

settingsRouter.put('/', authorizeRoles('admin'), handleUpdateSettings);
settingsRouter.patch('/', authorizeRoles('admin'), handleUpdateSettings);
