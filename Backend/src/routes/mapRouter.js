import { Router } from 'express';
import { store } from '../db/store.js';

export const mapRouter = Router();

// GET /api/facility-map
mapRouter.get('/', (req, res) => {
  try {
    const mapData = store.getMap();
    res.json(mapData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch facility map', message: err.message });
  }
});
