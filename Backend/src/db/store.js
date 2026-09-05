import {
  INITIAL_STATIONS,
  INITIAL_ALERTS,
  INITIAL_MAP,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  SEEDED_FACILITIES,
} from '../data/seedData.js';

class DataStore {
  constructor() {
    this.facilities = [...SEEDED_FACILITIES];
    this.stations = [...INITIAL_STATIONS];
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.map = JSON.parse(JSON.stringify(INITIAL_MAP));
    this.settings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
    this.users = [...INITIAL_USERS];
    this.accessRequests = [];
    this.roleRequests = [];
    this.auditLogs = [];
    this.adminNotifications = [];
    this.listeners = new Set();
  }

  onDataChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(channel, payload) {
    this.listeners.forEach((cb) => {
      try {
        cb(channel, payload);
      } catch (err) {
        console.error('Listener notify error:', err);
      }
    });
  }

  // ─── Stations ─────────────────────────────────────────────────────────────
  getStations(filters = {}) {
    let list = [...this.stations];

    if (filters.facilityId && filters.facilityId !== 'all') {
      list = list.filter(
        (s) =>
          s.facilityId === filters.facilityId ||
          s.warehouse?.toLowerCase() === filters.facilityId.toLowerCase() ||
          s.facility?.toLowerCase() === filters.facilityId.toLowerCase()
      );
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((s) => s.status === filters.status);
    }

    if (filters.zone && filters.zone !== 'all') {
      list = list.filter((s) => s.zone === filters.zone);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.warehouse.toLowerCase().includes(q)
      );
    }

    const summary = {
      totalStations: this.stations.length,
      activeStations: this.stations.filter((s) => s.status === 'active' || s.status === 'online').length,
      pendingRefills: this.stations.filter((s) => s.bait < 25).length,
      stationsOffline: this.stations.filter((s) => s.status === 'offline').length,
      uptime: '98.8%',
      totalDetects24h: this.stations.reduce((acc, s) => acc + (s.detects || 0), 0),
    };

    return { summary, stations: list };
  }

  getStationById(id) {
    return this.stations.find((s) => s.id === id || s.code === id) || null;
  }

  addStation(req) {
    const code = req.stationId || req.code || `RB-${String(this.stations.length + 1).padStart(2, '0')}`;
    const facility = req.facility || req.site || req.warehouse || 'Warehouse A';

    const newStation = {
      id: code,
      code,
      stationId: code,
      facilityId: req.facilityId || 'site_1',
      facility,
      warehouse: facility,
      building: facility,
      zone: req.zone || 'Zone A',
      location: req.stationName || req.location || `${req.zone || 'Zone A'} Station`,
      fullAddress: req.fullAddress || `${req.stationName || 'Station'} - ${req.zone || 'Zone A'}`,
      bait: req.bait !== undefined ? Number(req.bait) : 100,
      baitPercent: req.bait !== undefined ? Number(req.bait) : 100,
      battery: req.battery !== undefined ? Number(req.battery) : 100,
      batteryPercent: req.battery !== undefined ? Number(req.battery) : 100,
      status: req.status || 'active',
      statusLabel: req.status === 'critical' ? 'Alert' : req.status === 'low_bait' ? 'Low Bait' : 'Online',
      alertBadge: req.status === 'critical' ? 'ALERT' : req.status === 'low_bait' ? 'LOW BAIT' : 'ONLINE',
      temperature: req.temperature || '22.0°C',
      humidity: req.humidity || '45%',
      lastActivity: 'Just now',
      detects: 0,
      aiConfidence: 'Clear - 100% AI',
      cameraActive: true,
      connectivity: req.connectivity || 'wifi',
      wifiName: req.wifiName || '',
      notifications: req.notifications || { rodent: true, offline: true, tamper: true, bait: true },
    };

    this.stations.unshift(newStation);
    this.notify('stations', this.getStations());
    this.notify('overview', this.getOverview());
    return newStation;
  }

  updateStation(id, updateReq) {
    const index = this.stations.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) return null;

    const current = this.stations[index];
    const updated = {
      ...current,
      ...updateReq,
      id: current.id,
      code: current.code,
      stationId: current.code,
      lastActivity: updateReq.lastActivity || 'Just now',
    };

    if (updateReq.bait !== undefined) {
      updated.baitPercent = Number(updateReq.bait);
    }
    if (updateReq.battery !== undefined) {
      updated.batteryPercent = Number(updateReq.battery);
    }

    this.stations[index] = updated;
    this.notify('stations', this.getStations());
    this.notify('overview', this.getOverview());
    return updated;
  }

  deleteStation(id) {
    const initialLen = this.stations.length;
    this.stations = this.stations.filter((s) => s.id !== id && s.code !== id);
    if (this.stations.length === initialLen) return false;

    this.notify('stations', this.getStations());
    this.notify('overview', this.getOverview());
    return true;
  }

  // ─── Alerts ────────────────────────────────────────────────────────────────
  getAlerts() {
    return this.alerts;
  }

  addAlert(alertReq) {
    const newAlert = {
      id: `alt-${Date.now()}`,
      type: alertReq.type || 'rodent',
      title: alertReq.title || 'Sensor Alert',
      stationCode: alertReq.stationCode || 'RB-01',
      stationId: alertReq.stationId || 'RB-01',
      facilityId: alertReq.facilityId || 'site_1',
      location: alertReq.location || 'Warehouse A',
      timeAgo: 'Just now',
      statusText: 'Open',
      statusTone: alertReq.type === 'rodent' ? 'red' : 'amber',
      iconType: alertReq.type || 'rodent',
    };

    if (this.alerts.groups && this.alerts.groups.length > 0) {
      this.alerts.groups[0].items.unshift(newAlert);
      this.alerts.header.unreadCount += 1;
      this.alerts.header.activeAlertsCount += 1;
    }

    this.notify('alerts', this.alerts);
    this.notify('overview', this.getOverview());
    return newAlert;
  }

  resolveAlert(id) {
    let found = null;
    for (const grp of this.alerts.groups || []) {
      const match = grp.items.find((item) => item.id === id);
      if (match) {
        match.statusText = 'Resolved';
        match.statusTone = 'muted';
        found = match;
        break;
      }
    }

    if (found) {
      this.alerts.header.activeAlertsCount = Math.max(0, this.alerts.header.activeAlertsCount - 1);
      this.notify('alerts', this.alerts);
      this.notify('overview', this.getOverview());
    }
    return found;
  }

  // ─── Overview ─────────────────────────────────────────────────────────────
  getOverview() {
    const total = this.stations.length;
    const active = this.stations.filter((s) => s.status === 'active' || s.status === 'online').length;
    const refills = this.stations.filter((s) => s.bait < 25).length;
    const offline = this.stations.filter((s) => s.status === 'offline').length;
    const totalDetects = this.stations.reduce((acc, s) => acc + (s.detects || 0), 0);

    const healthScore = total > 0 ? Math.round(((active - offline) / total) * 100) : 100;

    return {
      health: {
        score: Math.max(60, Math.min(100, healthScore)),
        stats: [
          { id: 'active', label: 'Active', value: active, total, tone: 'success' },
          { id: 'refills', label: 'Refills', value: refills, total, tone: 'warning' },
          { id: 'offline', label: 'Offline', value: offline, total, tone: 'danger' },
          { id: 'total', label: 'Total', value: total, unit: 'stations', tone: 'neutral' },
        ],
      },
      stations: this.stations.slice(0, 5).map((s, idx) => ({
        id: s.code,
        zone: s.zone,
        x: 30 + idx * 10,
        y: 45 + (idx % 2) * 15,
        status: s.status === 'critical' ? 'alert' : s.status,
        battery: s.battery,
        bait: `${s.bait}%`,
        lastSeen: s.lastActivity,
      })),
      activity: {
        total: totalDetects || 42,
        changePercent: 18,
        comparisonLabel: 'vs yesterday',
        series: [12, 16, 24, 28, 35, 40, 38, 25, 20, 25, 35, totalDetects || 50],
        labels: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
      },
      species: {
        total: totalDetects || 87,
        caption: 'Total detections',
        breakdown: [
          { id: 'rat', label: 'Rat', percent: 62 },
          { id: 'mouse', label: 'Mouse', percent: 27 },
          { id: 'other', label: 'Other', percent: 11 },
        ],
      },
      alerts: {
        unreadCount: this.alerts.header.unreadCount,
        items: (this.alerts.groups[0]?.items || []).slice(0, 3).map((a) => ({
          id: a.id,
          severity: a.statusTone === 'red' ? 'alert' : 'warning',
          title: a.title,
          stationId: a.stationCode,
          location: a.location,
          timeAgo: a.timeAgo,
        })),
      },
      meta: {
        lastSync: new Date().toLocaleTimeString(),
        activeFacility: 'All Facilities',
      },
    };
  }

  // ─── Map ──────────────────────────────────────────────────────────────────
  getMap() {
    return this.map;
  }

  // ─── Settings ─────────────────────────────────────────────────────────────
  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings) {
    this.settings = {
      ...this.settings,
      ...newSettings,
      system: {
        ...this.settings.system,
        lastSync: 'Just now',
      },
    };
    return this.settings;
  }

  // ─── Users ────────────────────────────────────────────────────────────────
  getUsers() {
    return this.users.map((u) => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
  }

  addUser(userReq) {
    const newUser = {
      id: userReq.id || `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: userReq.name,
      initials: userReq.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      email: userReq.email.toLowerCase(),
      password: userReq.password || 'password123',
      role: userReq.role || 'viewer',
      roleLabel:
        userReq.role === 'admin'
          ? 'System Administrator'
          : userReq.role === 'technician'
          ? 'Field Technician'
          : 'Read-Only Viewer',
      status: userReq.status || 'active',
      facilityIds: userReq.facilityIds || ['site_1'],
      company: userReq.company || 'Bait Guard Client',
      createdAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    return newUser;
  }

  getUserById(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  updateUserRole(userId, newRole, changedBy = 'system', reason = 'Administrative role update') {
    const user = this.users.find((u) => u.id === userId || u.email.toLowerCase() === (userId || '').toLowerCase());
    if (!user) {
      const err = new Error(`User "${userId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    const normalizedRole = (newRole || '').trim().toLowerCase();
    const VALID_ROLES = ['viewer', 'technician', 'admin'];
    if (!VALID_ROLES.includes(normalizedRole)) {
      const err = new Error(`Invalid role "${newRole}". Allowed roles are: ${VALID_ROLES.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const oldRole = user.role;
    user.role = normalizedRole;
    user.roleLabel =
      normalizedRole === 'admin'
        ? 'System Administrator'
        : normalizedRole === 'technician'
        ? 'Field Technician'
        : 'Read-Only Viewer';

    if (normalizedRole === 'admin') {
      user.facilityIds = ['site_1', 'site_2', 'site_3', 'site_4', 'site_5'];
    } else if (normalizedRole === 'technician' && (!user.facilityIds || user.facilityIds.length <= 1)) {
      user.facilityIds = ['site_1', 'site_2'];
    }

    user.updatedAt = new Date().toISOString();

    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action: 'USER_ROLE_CHANGED',
      changedBy: changedBy || 'system',
      targetUserId: user.id,
      targetUserEmail: user.email,
      oldRole,
      newRole: normalizedRole,
      reason,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(auditEntry);
    this.notify('users_updated', { user, auditEntry });

    const safe = { ...user };
    delete safe.password;
    return safe;
  }

  // ─── Role Requests (RBAC Workflow) ──────────────────────────────────────────
  getRoleRequests(filter = {}) {
    let list = [...this.roleRequests];
    if (filter.userId) {
      list = list.filter((r) => r.userId === filter.userId);
    }
    if (filter.userEmail) {
      const em = filter.userEmail.toLowerCase();
      list = list.filter((r) => r.userEmail === em);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter((r) => r.status === filter.status);
    }
    return list;
  }

  addRoleRequest(req) {
    const rawRole = (req.requestedRole || '').trim().toLowerCase();
    const VALID_ROLES = ['viewer', 'technician', 'admin'];
    if (!VALID_ROLES.includes(rawRole)) {
      const err = new Error(`Invalid requested role "${req.requestedRole}". Allowed roles: ${VALID_ROLES.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const email = (req.userEmail || req.email || '').trim().toLowerCase();
    if (!email) {
      const err = new Error('User email is required to submit a role request');
      err.statusCode = 400;
      throw err;
    }

    // Prevent duplicate pending requests for this user
    const existingPending = this.roleRequests.find(
      (r) => (r.userEmail === email || (req.userId && r.userId === req.userId)) && r.status === 'pending'
    );
    if (existingPending) {
      const err = new Error(`A pending role request for "${existingPending.requestedRole}" is already awaiting review. Duplicate requests are not permitted.`);
      err.statusCode = 409;
      throw err;
    }

    const targetUser = this.getUserByEmail(email) || (req.userId ? this.getUserById(req.userId) : null);
    const currentRole = targetUser?.role || req.currentRole || 'viewer';

    if (currentRole === rawRole) {
      const err = new Error(`User already has the "${rawRole}" role.`);
      err.statusCode = 400;
      throw err;
    }

    const newRequest = {
      id: req.id || `rr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: targetUser?.id || req.userId || null,
      userEmail: email,
      fullName: targetUser?.name || req.fullName || email.split('@')[0],
      currentRole,
      requestedRole: rawRole,
      status: 'pending',
      facility: req.facility || 'Warehouse A',
      message: req.message || `Requesting ${rawRole} permissions`,
      subject: req.subject || `Requesting ${rawRole} role for ${req.facility || 'facility'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
    };

    this.roleRequests.unshift(newRequest);
    this.notify('role_request_created', newRequest);
    return newRequest;
  }

  approveRoleRequest(requestId, reviewedBy = 'system') {
    const req = this.roleRequests.find((r) => r.id === requestId);
    if (!req) {
      const err = new Error(`Role request "${requestId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    if (req.status !== 'pending') {
      const err = new Error(`Role request is already "${req.status}"`);
      err.statusCode = 400;
      throw err;
    }

    let user = req.userId ? this.getUserById(req.userId) : null;
    if (!user && req.userEmail) {
      user = this.getUserByEmail(req.userEmail);
    }
    if (!user) {
      const err = new Error(`Target user "${req.userEmail || req.userId}" not found in database`);
      err.statusCode = 404;
      throw err;
    }

    const oldRole = user.role;
    user.role = req.requestedRole;
    user.roleLabel =
      req.requestedRole === 'admin'
        ? 'System Administrator'
        : req.requestedRole === 'technician'
        ? 'Field Technician'
        : 'Read-Only Viewer';

    if (req.requestedRole === 'admin') {
      user.facilityIds = ['site_1', 'site_2', 'site_3', 'site_4', 'site_5'];
    } else if (req.requestedRole === 'technician') {
      const facilityMap = {
        'Warehouse A': 'site_1',
        'Warehouse B': 'site_2',
        'Distribution Center': 'site_3',
        'Cold Storage': 'site_4',
        'Manufacturing Plant': 'site_5',
      };
      const siteId = facilityMap[req.facility] || 'site_1';
      user.facilityIds = Array.from(new Set(['site_1', siteId]));
    }
    user.updatedAt = new Date().toISOString();

    req.status = 'approved';
    req.reviewedBy = reviewedBy;
    req.reviewedAt = new Date().toISOString();
    req.updatedAt = req.reviewedAt;

    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action: 'ROLE_REQUEST_APPROVED',
      changedBy: reviewedBy,
      targetUserId: user.id,
      targetUserEmail: user.email,
      oldRole,
      newRole: req.requestedRole,
      requestId: req.id,
      timestamp: req.reviewedAt,
      reason: `Approved role request ${req.id}`,
    };
    this.auditLogs.unshift(auditEntry);
    this.notify('role_request_approved', { request: req, user, auditEntry });

    const safeUser = { ...user };
    delete safeUser.password;
    return { request: req, user: safeUser };
  }

  rejectRoleRequest(requestId, reason = 'Administrative decision', reviewedBy = 'system') {
    const req = this.roleRequests.find((r) => r.id === requestId);
    if (!req) {
      const err = new Error(`Role request "${requestId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    if (req.status !== 'pending') {
      const err = new Error(`Role request is already "${req.status}"`);
      err.statusCode = 400;
      throw err;
    }

    req.status = 'rejected';
    req.rejectionReason = reason;
    req.reviewedBy = reviewedBy;
    req.reviewedAt = new Date().toISOString();
    req.updatedAt = req.reviewedAt;

    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action: 'ROLE_REQUEST_REJECTED',
      changedBy: reviewedBy,
      targetUserEmail: req.userEmail,
      requestedRole: req.requestedRole,
      requestId: req.id,
      reason,
      timestamp: req.reviewedAt,
    };
    this.auditLogs.unshift(auditEntry);
    this.notify('role_request_rejected', { request: req, auditEntry });

    return req;
  }

  // ─── Audit Logs ───────────────────────────────────────────────────────────
  getAuditLogs() {
    return this.auditLogs;
  }

  deleteUser(id) {
    const init = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < init;
  }

  // ─── Access Requests ──────────────────────────────────────────────────────
  getAccessRequests() {
    return this.accessRequests;
  }

  addAccessRequest(req) {
    const newReq = {
      id: req.id || `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fullName: req.fullName,
      email: req.email,
      password: req.password || '',
      normalizedEmail: req.email.trim().toLowerCase(),
      company: req.company || '',
      phone: req.phone || '',
      department: req.department || '',
      message: req.message || '',
      subject: req.subject || '',
      facility: req.facility || 'Warehouse A',
      requestedRole: req.requestedRole || null,
      source: req.source || 'signup_form',
      senderUid: req.senderUid || null,
      status: 'pending',
      reviewedAt: null,
      reviewedBy: null,
      submittedAt: new Date().toISOString(),
    };
    this.accessRequests.unshift(newReq);
    return newReq;
  }

  approveAccessRequest(id, reviewedBy = null) {
    const req = this.accessRequests.find((r) => r.id === id);
    if (!req) return null;

    req.status = 'approved';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = reviewedBy;

    const normalizedEmail = (req.email || '').trim().toLowerCase();
    const rawRole = (req.requestedRole || 'viewer').toLowerCase();
    const targetRole = rawRole.includes('admin')
      ? 'admin'
      : rawRole.includes('tech')
      ? 'technician'
      : 'viewer';
    const roleLabel =
      targetRole === 'admin'
        ? 'System Administrator'
        : targetRole === 'technician'
        ? 'Field Technician'
        : 'Read-Only Viewer';

    const facilityMap = {
      'Warehouse A': 'site_1',
      'Warehouse B': 'site_2',
      'Distribution Center': 'site_3',
      'Cold Storage': 'site_4',
      'Manufacturing Plant': 'site_5',
      'Admin Wing': 'site_1',
    };
    const targetSite = facilityMap[req.facility] || 'site_1';
    const facilityIds =
      targetRole === 'admin'
        ? ['site_1', 'site_2', 'site_3', 'site_4', 'site_5']
        : targetRole === 'technician'
        ? Array.from(new Set(['site_1', targetSite]))
        : [targetSite];

    const PROTECTED_TEST_EMAILS = [
      'admin@baitguard.com',
      'technician@baitguard.com',
      'user@baitguard.com',
    ];
    const isProtected = PROTECTED_TEST_EMAILS.includes(normalizedEmail);

    // Check if user already exists (role change request)
    const existingUser = this.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      if (!isProtected) {
        existingUser.role = targetRole;
        existingUser.roleLabel = roleLabel;
        existingUser.facilityIds = facilityIds;
        if (req.password) existingUser.password = req.password;
      }
    } else {
      this.addUser({
        name: req.fullName,
        email: req.email,
        password: req.password || 'password123',
        role: targetRole,
        facilityIds,
        company: req.company,
      });
    }

    return req;
  }

  rejectAccessRequest(id, reason = 'Administrative decision', reviewedBy = null) {
    const req = this.accessRequests.find((r) => r.id === id);
    if (!req) return null;

    req.status = 'rejected';
    req.rejectionReason = reason;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = reviewedBy;
    return req;
  }

  // ─── Admin Notifications ──────────────────────────────────────────────────
  getAdminNotifications() {
    return this.adminNotifications;
  }

  addAdminNotification(notification) {
    const entry = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      source: notification.source || 'unknown',
      fullName: notification.fullName || 'Unknown',
      email: notification.email || '',
      subject: notification.subject || '',
      message: notification.message || '',
      facility: notification.facility || '',
      requestedRole: notification.requestedRole || null,
      requestId: notification.requestId || null,
      createdAt: new Date().toISOString(),
      read: false,
    };
    this.adminNotifications.unshift(entry);

    // Broadcast to connected admin WebSocket clients
    this.notify('admin_notification', entry);

    return entry;
  }

  markNotificationRead(id) {
    const notif = this.adminNotifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return notif;
  }
}

export const store = new DataStore();
