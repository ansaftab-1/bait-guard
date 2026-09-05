import { Router } from 'express';
import { store } from '../db/store.js';

export const adminNotificationRouter = Router();

/**
 * POST /api/admin/notify
 * 
 * Receives admin notification when a new access request or contact message
 * is submitted. Logs the notification, stores it, and broadcasts via WebSocket.
 * 
 * Replaces Firebase Cloud Functions (unavailable on Spark Plan).
 */
adminNotificationRouter.post('/notify', (req, res) => {
  try {
    const { source, fullName, email, subject, message, facility, requestedRole, requestId } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Missing required fields: fullName, email' });
    }

    const sourceLabel = source === 'contact_message' ? 'Contact Admin Message' : 'Access Request';
    
    // Log notification to console (placeholder for SMTP/SendGrid email)
    console.log(`\n══════════════════════════════════════════════════════`);
    console.log(`📧 ADMIN NOTIFICATION — ${sourceLabel}`);
    console.log(`──────────────────────────────────────────────────────`);
    console.log(`  From:      ${fullName} <${email}>`);
    console.log(`  Source:    ${source || 'signup_form'}`);
    if (subject)       console.log(`  Subject:   ${subject}`);
    if (facility)      console.log(`  Facility:  ${facility}`);
    if (requestedRole) console.log(`  Role:      ${requestedRole}`);
    if (message)       console.log(`  Message:   ${message.slice(0, 200)}${message.length > 200 ? '...' : ''}`);
    if (requestId)     console.log(`  Request ID: ${requestId}`);
    console.log(`  Time:      ${new Date().toISOString()}`);
    console.log(`══════════════════════════════════════════════════════\n`);

    // Store notification
    const notification = store.addAdminNotification({
      source: source || 'signup_form',
      fullName,
      email,
      subject: subject || '',
      message: message || '',
      facility: facility || '',
      requestedRole: requestedRole || null,
      requestId: requestId || null,
    });

    res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error('[Admin Notify Error]', err);
    res.status(500).json({ error: 'Failed to process admin notification', message: err.message });
  }
});

/**
 * GET /api/admin/notifications
 * 
 * Retrieves all admin notifications (newest first).
 */
adminNotificationRouter.get('/notifications', (req, res) => {
  try {
    const notifications = store.getAdminNotifications();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications', message: err.message });
  }
});

/**
 * PUT /api/admin/notifications/:id/read
 * 
 * Mark a notification as read.
 */
adminNotificationRouter.put('/notifications/:id/read', (req, res) => {
  try {
    const notif = store.markNotificationRead(req.params.id);
    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification', message: err.message });
  }
});
