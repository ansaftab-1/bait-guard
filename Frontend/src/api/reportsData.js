import { apiClient } from './client';

export const MOCK_REPORTS_DATA = {
  kpis: [
    {
      id: 'detections',
      label: 'Total Detections',
      value: '87',
      change: '+12%',
      isPositive: true,
      color: '#ef4444',
      badgeBg: '#ecfdf5',
      badgeColor: '#10b981',
    },
    {
      id: 'refills',
      label: 'Bait Refills',
      value: '34',
      change: '-4%',
      isPositive: false,
      color: '#f59e0b',
      badgeBg: '#fef2f2',
      badgeColor: '#ef4444',
    },
    {
      id: 'uptime',
      label: 'System Uptime',
      value: '99.1%',
      change: '+0.3%',
      isPositive: true,
      color: '#10b981',
      badgeBg: '#ecfdf5',
      badgeColor: '#10b981',
    },
    {
      id: 'confidence',
      label: 'AI Confidence',
      value: '96%',
      change: '+2%',
      isPositive: true,
      color: '#2563eb',
      badgeBg: '#ecfdf5',
      badgeColor: '#10b981',
    },
  ],

  exporters: [
    {
      id: 'monthly-activity',
      title: 'Monthly activity',
      subtitle: 'June 2026 · All stations',
      format: 'PDF',
      formatBg: '#eff6ff',
      formatColor: '#2563eb',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      letter: 'D',
    },
    {
      id: 'bait-consumption',
      title: 'Bait consumption',
      subtitle: 'Last 30 days',
      format: 'CSV',
      formatBg: '#ecfdf5',
      formatColor: '#10b981',
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
      letter: 'D',
    },
    {
      id: 'compliance-audit',
      title: 'Compliance audit',
      subtitle: 'Q2 2026 · Audit trail',
      format: 'PDF',
      formatBg: '#f5f3ff',
      formatColor: '#7c3aed',
      iconBg: '#f5f3ff',
      iconColor: '#7c3aed',
      letter: 'D',
    },
  ],

  recentExports: [
    {
      id: 'rec-1',
      title: 'Compliance audit Q2',
      subtitle: 'PDF · 2.4 MB · 2h ago',
      letter: 'D',
      iconBg: '#f5f3ff',
      iconColor: '#7c3aed',
    },
    {
      id: 'rec-2',
      title: 'Bait consumption May',
      subtitle: 'CSV · 84 KB · Yesterday',
      letter: 'D',
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
    },
    {
      id: 'rec-3',
      title: 'Monthly activity Apr',
      subtitle: 'PDF · 1.9 MB · 3 days ago',
      letter: 'D',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
  ],

  trendSeries: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    points: [30, 70, 42, 55, 20, 70, 70],
    title: 'Detections Trend (Week View)',
  },

  stationLedger: [
    {
      id: 'RB-07',
      location: 'Warehouse B',
      detections: 22,
      refills: 4,
      uptimePercent: 100,
      color: '#10b981',
    },
    {
      id: 'RB-03',
      location: 'Cold storage',
      detections: 28,
      refills: 6,
      uptimePercent: 100,
      color: '#10b981',
    },
    {
      id: 'RB-01',
      location: 'Kitchen area',
      detections: 18,
      refills: 3,
      uptimePercent: 100,
      color: '#10b981',
    },
    {
      id: 'RB-09',
      location: 'Parking lot',
      detections: 5,
      refills: 1,
      uptimePercent: 87,
      color: '#f59e0b',
    },
    {
      id: 'RB-12',
      location: 'Main entrance',
      detections: 14,
      refills: 2,
      uptimePercent: 98,
      color: '#2563eb',
    },
  ],
};

export const fetchReportsData = async () => {
  const serverData = await apiClient.get('/reports');
  if (serverData) {
    return serverData;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_REPORTS_DATA);
    }, 200);
  });
};
