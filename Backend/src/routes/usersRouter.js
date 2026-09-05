import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const usersRouter = Router();

// All user management routes are restricted to authenticated administrators
usersRouter.use(authenticateUser);

// GET /api/users - Admin only
usersRouter.get('/', authorizeRoles('admin'), (req, res) => {
  try {
    const users = store.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', message: err.message });
  }
});

// GET /api/users/:id - Admin only
usersRouter.get('/:id', authorizeRoles('admin'), (req, res) => {
  try {
    const user = store.getUserById(req.params.id) || store.getUserByEmail(req.params.id);
    if (!user) {
      return res.status(404).json({ error: `User "${req.params.id}" not found` });
    }
    const safeUser = { ...user };
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', message: err.message });
  }
});

// PATCH /api/users/:id/role - Admin changes user role directly
usersRouter.patch('/:id/role', authorizeRoles('admin'), (req, res) => {
  try {
    const { role, reason } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required in request body' });
    }

    const updatedUser = store.updateUserRole(
      req.params.id,
      role,
      req.user.email,
      reason || `Direct role assignment by ${req.user.email}`
    );

    res.json({
      success: true,
      message: `User role successfully updated to "${updatedUser.role}"`,
      user: updatedUser,
    });
  } catch (err) {
    const status = err.statusCode || 400;
    res.status(status).json({ error: 'Failed to update user role', message: err.message });
  }
});

// POST /api/users - Admin creates new user account
usersRouter.post('/', authorizeRoles('admin'), (req, res) => {
  try {
    const user = store.addUser(req.body);
    const safe = { ...user };
    delete safe.password;
    res.status(201).json(safe);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', message: err.message });
  }
});

// DELETE /api/users/:id - Admin deletes user account
usersRouter.delete('/:id', authorizeRoles('admin'), (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id || req.user.email.toLowerCase() === req.params.id.toLowerCase()) {
      return res.status(400).json({ error: 'Admins cannot delete their own active account' });
    }

    const success = store.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: `User "${req.params.id}" not found` });
    }
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', message: err.message });
  }
});
