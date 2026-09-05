import { Router } from 'express';
import { store } from '../db/store.js';

export const overviewRouter = Router();

// GET /api/overview
overviewRouter.get('/', (req, res) => {
  try {
    const overview = store.getOverview();
    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch overview metrics', message: err.message });
  }
});
