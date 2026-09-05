/**
 * cleanupLegacyMocks.js
 * Automatically purges any legacy fake/mock users or requests from localStorage
 * on application boot to ensure 100% clean, authentic data across all views.
 */

export function cleanupLegacyMockData() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    // 1. Purge legacy mock system users
    const storedUsers = localStorage.getItem('baitguard_system_users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (Array.isArray(parsed)) {
        const cleanUsers = parsed.filter(
          (u) =>
            u.email !== 'alex.rivera@company.com' &&
            u.email !== 'sarah.chen@company.com' &&
            u.email !== 'mj.williams@company.com' &&
            u.email !== 'alex.k@ratguard.ai' &&
            u.email !== 'tech@baitguard.com'
        );
        localStorage.setItem('baitguard_system_users', JSON.stringify(cleanUsers));
      }
    }

    // 2. Purge legacy mock notifications
    const storedNotifs = localStorage.getItem('baitguard_notifications');
    if (storedNotifs) {
      try {
        const parsed = JSON.parse(storedNotifs);
        if (Array.isArray(parsed)) {
          const cleanNotifs = parsed.filter(
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
          localStorage.setItem('baitguard_notifications', JSON.stringify(cleanNotifs));
        }
      } catch {
        localStorage.removeItem('baitguard_notifications');
      }
    }

    // 3. Purge legacy mock pending access requests
    const storedReqs = localStorage.getItem('baitguard_pending_access_requests');
    if (storedReqs) {
      const parsed = JSON.parse(storedReqs);
      if (Array.isArray(parsed)) {
        const cleanReqs = parsed.filter(
          (r) =>
            r.id !== 'req-sample-1' &&
            r.id !== 'req-sample-2' &&
            r.email !== 'sarah.j@acmefoods.com' &&
            r.email !== 'john.smith@logisticscorp.com'
        );
        localStorage.setItem('baitguard_pending_access_requests', JSON.stringify(cleanReqs));
      }
    }

    // 4. Purge legacy mock all access requests
    const storedAllReqs = localStorage.getItem('baitguard_access_requests');
    if (storedAllReqs) {
      const parsed = JSON.parse(storedAllReqs);
      if (Array.isArray(parsed)) {
        const cleanAllReqs = parsed.filter(
          (r) =>
            r.id !== 'req-sample-1' &&
            r.id !== 'req-sample-2' &&
            r.email !== 'sarah.j@acmefoods.com' &&
            r.email !== 'john.smith@logisticscorp.com'
        );
        localStorage.setItem('baitguard_access_requests', JSON.stringify(cleanAllReqs));
      }
    }
  } catch (err) {
    console.warn('[cleanupLegacyMockData notice]:', err.message);
  }
}

// Automatically invoke on module load
cleanupLegacyMockData();

export default cleanupLegacyMockData;
