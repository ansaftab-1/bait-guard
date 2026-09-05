import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const stationsRouter = Router();

// Authentication required for station telemetry endpoints
stationsRouter.use(authenticateUser);

// GET /api/stations - Viewable by Viewer, Technician, Admin
stationsRouter.get('/', authorizeRoles('admin', 'technician', 'viewer'), (req, res) => {
  try {
    const { facilityId, status, zone, search } = req.query;
    const result = store.getStations({ facilityId, status, zone, search });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stations', message: err.message });
  }
});

// GET /api/stations/:id - Viewable by Viewer, Technician, Admin
stationsRouter.get('/:id', authorizeRoles('admin', 'technician', 'viewer'), (req, res) => {
  try {
    const station = store.getStationById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: `Station "${req.params.id}" not found` });
    }
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch station', message: err.message });
  }
});

// POST /api/stations - Restricted to Field Technician and Admin
stationsRouter.post('/', authorizeRoles('admin', 'technician'), (req, res) => {
  try {
    const created = store.addStation(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create station', message: err.message });
  }
});

// PUT /api/stations/:id - Restricted to Field Technician and Admin
stationsRouter.put('/:id', authorizeRoles('admin', 'technician'), (req, res) => {
  try {
    const updated = store.updateStation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: `Station "${req.params.id}" not found` });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update station', message: err.message });
  }
});

// DELETE /api/stations/:id - Strictly restricted to Admin
stationsRouter.delete('/:id', authorizeRoles('admin'), (req, res) => {
  try {
    const success = store.deleteStation(req.params.id);
    if (!success) {
      return res.status(404).json({ error: `Station "${req.params.id}" not found` });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete station', message: err.message });
  }
});
