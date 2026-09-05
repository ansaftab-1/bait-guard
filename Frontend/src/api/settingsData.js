import { apiClient } from './client';

export const MOCK_SETTINGS_DATA = {
  profile: {
    name: 'James Dalton',
    role: 'Senior Administrator',
    initials: 'JD',
    email: 'j.dalton@ratguard.ai',
    adminPanelUrl: '#admin-panel',
  },
  notifications: {
    pushEnabled: true,
    rodentDetected: true,
    lowBaitWarning: true,
    tamperDetected: false,
    stationOffline: true,
  },
  display: {
    darkMode: false,
    autoRefresh: true,
    refreshInterval: '30s',
  },
  site: {
    activeSite: 'all',
    sites: [
      { id: 'all', label: 'All facilities' },
      { id: 'fac-1', label: 'Facility 1 — Warehouse' },
      { id: 'fac-2', label: 'Facility 2 — Admin Wing' },
      { id: 'fac-3', label: 'Facility 3 — Distribution' },
    ],
  },
  system: {
    version: 'v1.4.2',
    deviceBrowser: 'Chrome / Windows',
    lastSync: 'Just now',
  },
};

export const fetchSettingsData = async () => {
  const serverData = await apiClient.get('/settings');
  if (serverData) {
    return serverData;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SETTINGS_DATA);
    }, 150);
  });
};

export const saveSettingsData = async (newSettings) => {
  const serverRes = await apiClient.put('/settings', newSettings);
  if (serverRes) {
    return serverRes;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, timestamp: new Date().toLocaleTimeString() });
    }, 200);
  });
};
