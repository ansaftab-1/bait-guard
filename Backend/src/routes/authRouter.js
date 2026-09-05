import { Router } from 'express';
import { store } from '../db/store.js';
import { signToken, authenticateUser } from '../middleware/authMiddleware.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const normalized = email.trim().toLowerCase();
  const user = store.users.find((u) => u.email.toLowerCase() === normalized);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const safeUser = { ...user };
  delete safeUser.password;

  // Protect test accounts: they must always retain their canonical roles for quick-fill testing
  if (normalized === 'admin@baitguard.com') {
    safeUser.role = 'admin';
    safeUser.roleLabel = 'System Administrator';
  } else if (normalized === 'technician@baitguard.com') {
    safeUser.role = 'technician';
    safeUser.roleLabel = 'Field Technician';
  } else if (normalized === 'user@baitguard.com') {
    safeUser.role = 'viewer';
    safeUser.roleLabel = 'Read-Only Viewer';
  }

  const token = signToken(safeUser);

  res.json({
    token,
    user: safeUser,
  });
});

// GET /api/auth/me (Returns live, latest database profile for authenticated user)
authRouter.get('/me', authenticateUser, (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.password;
  res.json({ user: safeUser });
});

// POST /api/auth/signup
authRouter.post('/signup', (req, res) => {
  const { email, name, role, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalized = email.trim().toLowerCase();
  const exists = store.users.find((u) => u.email.toLowerCase() === normalized);
  if (exists) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = store.addUser({
    name: name || email.split('@')[0],
    email: normalized,
    password: password || 'password123',
    role: role || 'viewer',
  });

  const safeUser = { ...newUser };
  delete safeUser.password;
  const token = signToken(safeUser);

  res.status(201).json({
    token,
    user: safeUser,
  });
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

