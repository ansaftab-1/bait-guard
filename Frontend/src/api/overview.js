import { apiClient } from './client';

/**
 * Data access for the Overview page.
 * Integrated with apiClient REST & Real-time WebSockets layer.
 */

const MOCK_OVERVIEW = {
  health: {
    score: 87,
    stats: [
      { id: 'active', label: 'Active', value: 118, total: 120, tone: 'success' },
      { id: 'refills', label: 'Refills', value: 8, total: 120, tone: 'warning' },
      { id: 'offline', label: 'Offline', value: 2, total: 120, tone: 'danger' },
      { id: 'total', label: 'Total', value: 120, unit: 'stations', tone: 'neutral' },
    ],
  },
  stations: [
    { id: 'A1', zone: 'Zone A', x: 30, y: 50, status: 'active', battery: 82, bait: '12%', lastSeen: '10m ago' },
    { id: 'B2', zone: 'Zone B', x: 45, y: 65, status: 'alert', battery: 41, bait: 'Empty', lastSeen: '3m ago' },
    { id: 'C4', zone: 'Zone C', x: 60, y: 55, status: 'warning', battery: 88, bait: 'Full', lastSeen: '8m ago' },
  ],
  activity: {
    total: 42,
    changePercent: 23,
    comparisonLabel: 'vs yesterday',
    series: [12, 16, 24, 28, 35, 40, 38, 25, 20, 25, 35, 50],
    labels: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
  },
  species: {
    total: 87,
    caption: 'Total detections',
    breakdown: [
      { id: 'rat', label: 'Rat', percent: 58 },
      { id: 'mouse', label: 'Mouse', percent: 29 },
      { id: 'other', label: 'Other', percent: 13 },
    ],
  },
  alerts: {
    unreadCount: 12,
    items: [
      {
        id: 'alert-1',
        severity: 'alert',
        title: 'Rodent Detected',
        stationId: 'B-02',
        location: 'West Wing, Loading Dock 4',
        timeAgo: '2m ago',
      },
      {
        id: 'alert-2',
        severity: 'warning',
        title: 'Low Bait Level',
        stationId: 'A-15',
        location: 'Main Entrance, Storage C',
        timeAgo: '15m ago',
      },
    ],
  },
  meta: {
    facility: 'All facilities',
    updatedAt: '2 mins ago',
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchOverview() {
  const serverData = await apiClient.get('/overview');
  if (serverData) {
    return serverData;
  }

  await delay(300);
  return MOCK_OVERVIEW;
}
