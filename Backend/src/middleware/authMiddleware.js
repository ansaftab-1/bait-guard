import jwt from 'jsonwebtoken';
import { store } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'baitguard_super_secure_jwt_secret_key_2026';
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Sign a secure JWT containing user identification.
 * Role is NOT trusted from token claims on authorization; the database is the source of truth.
 */
export function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Authentication Middleware
 * Answers: "Who is this user?"
 * Cryptographically verifies the token, then loads the current user record
 * directly from the database. This ensures stale tokens cannot bypass role changes.
 */
export function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers['x-access-token'];
    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token is required. Please provide a Bearer token.',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authorization token format',
      });
    }

    let decoded = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      // Backward compatibility: support existing format "bg_jwt_<base64Email>_<timestamp>"
      if (token.startsWith('bg_jwt_')) {
        const parts = token.split('_');
        if (parts.length >= 3) {
          try {
            const email = Buffer.from(parts[2], 'base64').toString('utf8');
            decoded = { email };
          } catch {
            // failed
          }
        }
      }

      if (!decoded) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid, corrupted, or expired authentication token',
        });
      }
    }

    // Single source of truth: retrieve current user directly from the database
    let user = null;
    if (decoded.userId) {
      user = store.getUserById(decoded.userId);
    }
    if (!user && decoded.email) {
      user = store.getUserByEmail(decoded.email);
    }

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account associated with this token was not found',
      });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Your account has been deactivated. Please contact an administrator.',
      });
    }

    // Attach verified live database user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  }
}

/**
 * Authorization Middleware Factory
 * Answers: "What is this authenticated user allowed to do?"
 * Validates the user's current database role against permitted roles.
 */
export function authorizeRoles(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication is required before authorization',
      });
    }

    const currentRole = (req.user.role || '').toLowerCase().trim();

    if (!normalizedAllowed.includes(currentRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Requires one of [${allowedRoles.join(', ')}] role(s). Your current role is "${currentRole}".`,
        currentRole,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
}
