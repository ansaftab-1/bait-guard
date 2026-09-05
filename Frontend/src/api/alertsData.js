import { apiClient } from './client';

export const MOCK_ALERTS_DATA = {
  header: {
    unreadCount: 12,
    unresolvedCount: 2,
    activeAlertsCount: 2,
  },
  summaryCards: {
    high: { count: 2, title: 'High Severity Alerts', description: 'Immediate response required' },
    medium: { count: 3, title: 'Medium Alerts', description: 'Pending refills and battery warnings' },
    low: { count: 1, title: 'Low Alerts', description: 'Routine diagnostic messages' },
  },
  priorityBanner: {
    title: 'Critical Alerts Active',
    description: '2 need attention — RB-07 & RB-12 flagged high priority',
  },
  groups: [
    {
      id: 'today',
      title: 'Today',
      accentColor: '#ef4444',
      items: [
        {
          id: 'alt-1',
          type: 'rodent',
          title: 'Rat detected',
          stationCode: 'RB-07',
          stationId: 'RB-07',
          location: 'Warehouse B',
          timeAgo: '2:13 AM',
          statusText: 'Open',
          statusTone: 'red',
          iconType: 'rodent',
        },
        {
          id: 'alt-2',
          type: 'lowBait',
          title: 'Low bait (18%)',
          stationCode: 'RB-05',
          stationId: 'RB-05',
          location: 'Cold storage',
          timeAgo: '11:45 AM',
          statusText: 'Pending',
          statusTone: 'amber',
          iconType: 'bait',
        },
      ],
    },
    {
      id: 'earlier',
      title: 'Earlier',
      accentColor: '#94a3b8',
      items: [
        {
          id: 'alt-3',
          type: 'tamper',
          title: 'Tamper detected',
          stationCode: 'RB-12',
          stationId: 'RB-12',
          location: 'Main entrance',
          timeAgo: 'Yesterday',
          statusText: 'Open',
          statusTone: 'red',
          iconType: 'tamper',
        },
        {
          id: 'alt-4',
          type: 'offline',
          title: 'Station offline',
          stationCode: 'RB-09',
          stationId: 'RB-09',
          location: 'Parking lot',
          timeAgo: '2 days ago',
          statusText: 'In review',
          statusTone: 'purple',
          iconType: 'offline',
        },
        {
          id: 'alt-5',
          type: 'rodent',
          title: 'Mouse detected',
          stationCode: 'RB-01',
          stationId: 'RB-01',
          location: 'Kitchen area',
          timeAgo: '3 days ago',
          statusText: 'Resolved',
          statusTone: 'green',
          iconType: 'resolved',
        },
        {
          id: 'alt-6',
          type: 'lowBait',
          title: 'Low bait (22%)',
          stationCode: 'RB-05',
          stationId: 'RB-05',
          location: 'Loading bay',
          timeAgo: '4 days ago',
          statusText: 'Resolved',
          statusTone: 'green',
          iconType: 'resolved',
        },
      ],
    },
  ],
  weeklyActivity: [
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 7 },
    { day: 'Thu', value: 14 },
    { day: 'Fri', value: 10 },
    { day: 'Sat', value: 12 },
    { day: 'Sun', value: 13 },
  ],
  categoryBreakdown: [
    { id: 'rodent', label: 'Rodent detections', count: 14, color: '#e2453f', max: 14 },
    { id: 'lowBait', label: 'Low bait warnings', count: 8, color: '#f0a52c', max: 14 },
    { id: 'tamper', label: 'Tamper alerts', count: 3, color: '#fb7185', max: 14 },
    { id: 'offline', label: 'Offline events', count: 2, color: '#38bdf8', max: 14 },
  ],
  hotspots: [
    { rank: 1, id: 'RB-03', visits: 28, location: 'Cold storage', percent: 100 },
    { rank: 2, id: 'RB-07', visits: 22, location: 'Warehouse B', percent: 78 },
    { rank: 3, id: 'RB-01', visits: 18, location: 'Kitchen area', percent: 64 },
    { rank: 4, id: 'RB-12', visits: 14, location: 'Main entrance', percent: 50 },
  ],
};

/**
 * Fetch alerts data.
 * Calls backend `/alerts` REST endpoint when backend is ready,
 * with fallback to mock data contract.
 */
export const fetchAlertsData = async () => {
  const serverData = await apiClient.get('/alerts');
  if (serverData) {
    return serverData;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ALERTS_DATA);
    }, 150);
  });
};
