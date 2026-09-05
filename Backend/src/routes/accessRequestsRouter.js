import { Router } from 'express';
import { store } from '../db/store.js';

export const accessRequestsRouter = Router();

// GET /api/access-requests
accessRequestsRouter.get('/', (req, res) => {
  try {
    const requests = store.getAccessRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch access requests', message: err.message });
  }
});

// POST /api/access-requests
accessRequestsRouter.post('/', (req, res) => {
  try {
    const created = store.addAccessRequest(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create access request', message: err.message });
  }
});

// PUT /api/access-requests/:id/approve
accessRequestsRouter.put('/:id/approve', (req, res) => {
  try {
    const approved = store.approveAccessRequest(req.params.id, req.body.reviewedBy);
    if (!approved) {
      return res.status(404).json({ error: `Access request "${req.params.id}" not found` });
    }
    res.json({ success: true, request: approved });
  } catch (err) {
    res.status(400).json({ error: 'Failed to approve access request', message: err.message });
  }
});

// PUT /api/access-requests/:id/reject
accessRequestsRouter.put('/:id/reject', (req, res) => {
  try {
    const rejected = store.rejectAccessRequest(req.params.id, req.body.reason, req.body.reviewedBy);
    if (!rejected) {
      return res.status(404).json({ error: `Access request "${req.params.id}" not found` });
    }
    res.json({ success: true, request: rejected });
  } catch (err) {
    res.status(400).json({ error: 'Failed to reject access request', message: err.message });
  }
});
