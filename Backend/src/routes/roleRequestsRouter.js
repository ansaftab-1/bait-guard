import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const roleRequestsRouter = Router();

// All role request routes require authentication
roleRequestsRouter.use(authenticateUser);

// GET /api/role-requests
// Admins see all role requests; regular users (viewer, technician) see only their own
roleRequestsRouter.get('/', (req, res) => {
  try {
    const isAdmin = (req.user.role || '').toLowerCase() === 'admin';
    const filter = isAdmin
      ? {}
      : { userId: req.user.id, userEmail: req.user.email };

    const list = store.getRoleRequests(filter);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch role requests', message: err.message });
  }
});

// POST /api/role-requests - Submit role upgrade request
// Enforces duplicate prevention & authenticates requester
roleRequestsRouter.post('/', (req, res) => {
  try {
    const { requestedRole, facility, message, subject } = req.body;

    if (!requestedRole) {
      return res.status(400).json({ error: 'Requested role is required' });
    }

    const created = store.addRoleRequest({
      userId: req.user.id,
      userEmail: req.user.email,
      fullName: req.user.name,
      currentRole: req.user.role,
      requestedRole,
      facility,
      message,
      subject,
    });

    res.status(201).json({
      success: true,
      message: `Role request for "${requestedRole}" submitted successfully. Awaiting administrator approval.`,
      request: created,
    });
  } catch (err) {
    const status = err.statusCode || 400;
    res.status(status).json({ error: 'Failed to submit role request', message: err.message });
  }
});

// PATCH /api/role-requests/:id/approve - Admin only
// Atomically approves request and updates target user's database role
roleRequestsRouter.patch('/:id/approve', authorizeRoles('admin'), (req, res) => {
  try {
    const result = store.approveRoleRequest(req.params.id, req.user.email);
    res.json({
      success: true,
      message: `Role request approved. User role updated to "${result.user.role}".`,
      request: result.request,
      user: result.user,
    });
  } catch (err) {
    const status = err.statusCode || 400;
    res.status(status).json({ error: 'Failed to approve role request', message: err.message });
  }
});

// PATCH /api/role-requests/:id/reject - Admin only
// Rejects request; user's role remains unchanged
roleRequestsRouter.patch('/:id/reject', authorizeRoles('admin'), (req, res) => {
  try {
    const { reason } = req.body;
    const rejected = store.rejectRoleRequest(
      req.params.id,
      reason || 'Administrative decision',
      req.user.email
    );
    res.json({
      success: true,
      message: 'Role request rejected. User role remains unchanged.',
      request: rejected,
    });
  } catch (err) {
    const status = err.statusCode || 400;
    res.status(status).json({ error: 'Failed to reject role request', message: err.message });
  }
});
