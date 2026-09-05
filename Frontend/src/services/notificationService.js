const NOTIFICATIONS_STORAGE_KEY = 'baitguard_notifications';
const PUSH_STORAGE_KEY = 'baitguard_push_enabled';
const EVENT_NOTIFICATIONS_CHANGED = 'baitguard_notifications_changed';
const EVENT_PUSH_CHANGED = 'baitguard_push_settings_changed';

function notifySubscribers(eventName) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(eventName));
  }
}

const DEFAULT_NOTIFICATIONS = [];

/**
 * Check if push notifications are enabled globally in settings
 * @returns {boolean}
 */
export function isPushEnabled() {
  try {
    const stored = localStorage.getItem(PUSH_STORAGE_KEY);
    if (stored !== null) {
      return JSON.parse(stored) === true;
    }
    return true; // default enabled
  } catch {
    return true;
  }
}

/**
 * Set push notifications enabled/disabled state globally
 * @param {boolean} enabled
 */
export function setPushEnabled(enabled) {
  try {
    localStorage.setItem(PUSH_STORAGE_KEY, JSON.stringify(Boolean(enabled)));
    notifySubscribers(EVENT_PUSH_CHANGED);
  } catch {
    // Ignore storage write error
  }
}

/**
 * Get all notifications from storage
 * @returns {Array<Object>}
 */
export function getNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Strip out legacy mock notifications
        return parsed.filter(
          (n) =>
            n &&
            n.id !== 'notif-1' &&
            n.id !== 'notif-2' &&
            n.id !== 'notif-3' &&
            n.id !== 'notif-4' &&
            n.id !== 'notif-5' &&
            n.title !== 'Rodent Motion Detected' &&
            n.title !== 'Low Battery Warning' &&
            n.title !== 'Telemetry Sync Completed' &&
            n.requestId !== 'req-sample-1' &&
            n.requestId !== 'req-sample-2' &&
            n.requesterEmail !== 'sarah.j@acmefoods.com' &&
            n.requesterEmail !== 'john.smith@logisticscorp.com'
        );
      }
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Add a new notification
 * @param {Object} item
 * @returns {Array<Object>} Updated notifications
 */
export function addNotification(item) {
  const list = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    time: 'Just now',
    read: false,
    priority: item.priority || 'medium',
    ...item,
  };

  const updated = [newNotif, ...list];
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers(EVENT_NOTIFICATIONS_CHANGED);
  } catch {
    // Ignore error
  }

  return updated;
}

/**
 * Mark a single notification as read
 * @param {string} id
 */
export function markAsRead(id) {
  const list = getNotifications();
  const updated = list.map((item) => (item.id === id ? { ...item, read: true } : item));
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers(EVENT_NOTIFICATIONS_CHANGED);
  } catch {
    // Ignore error
  }
  return updated;
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead() {
  const list = getNotifications();
  const updated = list.map((item) => ({ ...item, read: true }));
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers(EVENT_NOTIFICATIONS_CHANGED);
  } catch {
    // Ignore error
  }
  return updated;
}

/**
 * Clear all notifications
 */
export function clearAll() {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
    notifySubscribers(EVENT_NOTIFICATIONS_CHANGED);
  } catch {
    // Ignore error
  }
  return [];
}

/**
 * Delete a specific notification by ID
 * @param {string} id
 */
export function deleteNotification(id) {
  const list = getNotifications();
  const updated = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers(EVENT_NOTIFICATIONS_CHANGED);
  } catch {
    // Ignore error
  }
  return updated;
}

/**
 * Handle Approve / Reject action on a request notification
 * @param {string} notificationId
 * @param {'approve' | 'reject'} action
 */
export function handleRequestAction(notificationId, action) {
  const list = getNotifications();
  const updated = list.map((item) => {
    if (item.id === notificationId || item.requestId === notificationId) {
      return {
        ...item,
        read: true,
        requestStatus: action === 'approve' ? 'approved' : 'rejected',
        message: action === 'approve' ? `Approved: Access granted to ${item.requesterName || 'user'}.` : `Rejected: Access request for ${item.requesterName || 'user'} declined.`,
      };
    }
    return item;
  });

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers(EVENT_NOTIFICATIONS_CHANGED);
  } catch {
    // Ignore error
  }
  return updated;
}

/**
 * Subscribe to notification updates
 * @param {Function} callback
 * @returns {Function} Unsubscribe cleanup function
 */
export function subscribeNotifications(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(getNotifications());
  };

  window.addEventListener(EVENT_NOTIFICATIONS_CHANGED, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(EVENT_NOTIFICATIONS_CHANGED, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

/**
 * Subscribe to push settings updates
 * @param {Function} callback
 * @returns {Function} Unsubscribe cleanup function
 */
export function subscribePushSettings(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(isPushEnabled());
  };

  window.addEventListener(EVENT_PUSH_CHANGED, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(EVENT_PUSH_CHANGED, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
