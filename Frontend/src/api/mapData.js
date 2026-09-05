import { apiClient } from './client';

export const MOCK_STATIONS = [
  { id: '22', code: 'RA-22', zone: 'A', x: 30, y: 22, status: 'active', battery: 95, baitPercent: 80, location: 'Distribution Center, Dock 2', lastDetection: '6 hrs ago', lastRefill: '18 Oct, 2023', currentStatus: 'Active & Secure', calloutMessage: null },
  { id: '14', code: 'RA-14', zone: 'A', x: 22, y: 40, status: 'active', battery: 91, baitPercent: 72, location: 'Distribution Center, Bay 7', lastDetection: '2 days ago', lastRefill: '15 Oct, 2023', currentStatus: 'Active & Secure', calloutMessage: null },
  { id: '07', code: 'RB-07', zone: 'B', x: 48, y: 55, status: 'alert', battery: 82, baitPercent: 18, location: 'Warehouse B - Loading Dock 4', lastDetection: '14 Oct, 10:42 AM', lastRefill: '02 Sep, 2023', currentStatus: 'Rodent Detected', calloutMessage: 'Technician dispatch recommended within 24 hours to clear station and replenish bait.' },
  { id: '31', code: 'RC-31', zone: 'C', x: 60, y: 55, status: 'active', battery: 88, baitPercent: 65, location: 'Admin Wing, Entrance C', lastDetection: '1 day ago', lastRefill: '20 Oct, 2023', currentStatus: 'Active & Secure', calloutMessage: null },
  { id: '88', code: 'RC-88', zone: 'C', x: 52, y: 75, status: 'lowBait', battery: 79, baitPercent: 12, location: 'External Perimeter, Gate 3', lastDetection: '12 hrs ago', lastRefill: '25 Sep, 2023', currentStatus: 'Low Bait (Refill)', calloutMessage: 'Bait level is critically low. Schedule a refill soon to maintain coverage.' },
  { id: '92', code: 'RC-92', zone: 'C', x: 62, y: 73, status: 'active', battery: 94, baitPercent: 90, location: 'External Parking Lot B', lastDetection: '3 days ago', lastRefill: '22 Oct, 2023', currentStatus: 'Active & Secure', calloutMessage: null },
];

export const MOCK_ZONES = [
  { id: 'A', label: 'ZONE A', x: 12, y: 10, width: 42, height: 48 },
  { id: 'B', label: 'ZONE B', x: 38, y: 44, width: 28, height: 22 },
  { id: 'C', label: 'ZONE C', x: 42, y: 62, width: 35, height: 28 },
];

export const ZONE_SUMMARIES = [
  { id: 'A', title: 'Zone A: Distribution', totalStations: 42, stats: [{ label: 'active', value: 38, tone: 'green' }, { label: 'maintenance', value: 4, tone: 'muted' }] },
  { id: 'B', title: 'Zone B: Warehouse', totalStations: 38, stats: [{ label: 'alert', value: 2, tone: 'red' }, { label: 'low bait', value: 5, tone: 'amber' }] },
  { id: 'C', title: 'Zone C: Admin & External', totalStations: 40, stats: [{ label: 'active', value: 40, tone: 'green' }, { label: 'issues', value: 0, tone: 'muted' }] },
];

/**
 * Fetch facility map data.
 * Calls backend `/facility-map` REST endpoint when backend is ready,
 * with fallback to mock data contract.
 */
export const fetchMapData = async () => {
  const serverData = await apiClient.get('/facility-map');
  if (serverData) {
    return serverData;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stations: MOCK_STATIONS,
        zones: MOCK_ZONES,
        zoneSummaries: ZONE_SUMMARIES,
        meta: { totalStations: 120, totalZones: 3 },
      });
    }, 300);
  });
};
