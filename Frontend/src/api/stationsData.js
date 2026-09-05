import { apiClient } from './client';

const STORAGE_KEY = 'baitguard_stations_db'

export function getAvailableSitesList() {
  return ['Warehouse A', 'Warehouse B', 'Distribution Center', 'Admin Wing']
}

export const MOCK_STATIONS_DATA = {
  summary: {
    totalStations: 120,
    activeStations: 118,
    uptime: '98.4%',
    pendingRefills: 8,
    totalDetects24h: 42,
    stationsOffline: 2,
  },
  stations: [
    {
      id: 'RB-07',
      code: 'RB-07',
      stationId: 'RB-07',
      facility: 'Facility 1',
      warehouse: 'Warehouse B',
      building: 'Warehouse B',
      zone: 'Zone A',
      location: 'Warehouse B - North Wall',
      fullAddress: 'Warehouse B - North Wall\nLoading Dock 4',
      bait: 18,
      baitPercent: 18,
      battery: 82,
      batteryPercent: 82,
      status: 'critical',
      statusLabel: 'Alert',
      alertBadge: 'ALERT',
      temperature: '22.4°C',
      humidity: '48%',
      lastActivity: '14 Oct, 10:42 AM',
      detects: 22,
      aiConfidence: 'Rat - 96% AI',
      cameraActive: true,
      connectivity: 'wifi',
      wifiName: 'BaitGuard_Secure_5G',
      notifications: { rodent: true, offline: true, tamper: true, bait: true },
    },
    {
      id: 'RB-03',
      code: 'RB-03',
      stationId: 'RB-03',
      facility: 'Facility 1',
      warehouse: 'Warehouse B',
      building: 'Cold Storage',
      zone: 'Zone A',
      location: 'Cold storage',
      bait: 22,
      baitPercent: 22,
      battery: 78,
      batteryPercent: 78,
      status: 'low_bait',
      statusLabel: 'Low Bait',
      alertBadge: 'LOW BAIT',
      temperature: '18.1°C',
      humidity: '55%',
      lastActivity: '14 Oct, 08:15 AM',
      detects: 14,
      aiConfidence: 'Mouse - 88% AI',
      cameraActive: true,
      connectivity: 'wifi',
      wifiName: 'BaitGuard_Secure_5G',
      notifications: { rodent: true, offline: true, tamper: true, bait: true },
    },
    {
      id: 'RB-01',
      code: 'RB-01',
      stationId: 'RB-01',
      facility: 'Facility 1',
      warehouse: 'Warehouse A',
      building: 'Kitchen Area',
      zone: 'Zone B',
      location: 'Kitchen area',
      bait: 75,
      baitPercent: 75,
      battery: 92,
      batteryPercent: 92,
      status: 'online',
      statusLabel: 'Online',
      alertBadge: 'ONLINE',
      temperature: '21.0°C',
      humidity: '42%',
      lastActivity: '14 Oct, 11:30 AM',
      detects: 0,
      aiConfidence: 'Clear - 100% AI',
      cameraActive: true,
      connectivity: 'cellular',
      wifiName: '',
      notifications: { rodent: true, offline: true, tamper: false, bait: true },
    },
    {
      id: 'RB-05',
      code: 'RB-05',
      stationId: 'RB-05',
      facility: 'Facility 1',
      warehouse: 'Warehouse A',
      building: 'Loading Bay',
      zone: 'Zone B',
      location: 'Loading bay',
      bait: 60,
      baitPercent: 60,
      battery: 88,
      batteryPercent: 88,
      status: 'online',
      statusLabel: 'Online',
      alertBadge: 'ONLINE',
      temperature: '20.5°C',
      humidity: '45%',
      lastActivity: '14 Oct, 09:00 AM',
      detects: 3,
      aiConfidence: 'Clear - 100% AI',
      cameraActive: true,
      connectivity: 'wifi',
      wifiName: 'BaitGuard_Secure_5G',
      notifications: { rodent: true, offline: true, tamper: true, bait: true },
    },
    {
      id: 'RB-09',
      code: 'RB-09',
      stationId: 'RB-09',
      facility: 'Facility 1',
      warehouse: 'Warehouse A',
      building: 'Parking Lot',
      zone: 'Zone C',
      location: 'Parking lot',
      bait: 45,
      baitPercent: 45,
      battery: 12,
      batteryPercent: 12,
      status: 'low_battery',
      statusLabel: 'Low Battery',
      alertBadge: 'LOW BATT',
      temperature: '19.8°C',
      humidity: '50%',
      lastActivity: '13 Oct, 04:20 PM',
      detects: 5,
      aiConfidence: 'Clear - 100% AI',
      cameraActive: false,
      connectivity: 'cellular',
      wifiName: '',
      notifications: { rodent: true, offline: true, tamper: true, bait: true },
    },
    {
      id: 'RB-12',
      code: 'RB-12',
      stationId: 'RB-12',
      facility: 'Facility 1',
      warehouse: 'Warehouse B',
      building: 'Main Entrance',
      zone: 'Zone C',
      location: 'Main entrance',
      bait: 33,
      baitPercent: 33,
      battery: 5,
      batteryPercent: 5,
      status: 'low_battery',
      statusLabel: 'Low Battery',
      alertBadge: 'LOW BATT',
      temperature: '23.1°C',
      humidity: '40%',
      lastActivity: '12 Oct, 01:10 PM',
      detects: 1,
      aiConfidence: 'Clear - 100% AI',
      cameraActive: false,
      connectivity: 'wifi',
      wifiName: 'BaitGuard_Guest',
      notifications: { rodent: true, offline: true, tamper: true, bait: true },
    },
    {
      id: 'RB-08',
      code: 'RB-08',
      stationId: 'RB-08',
      facility: 'Facility 1',
      warehouse: 'Warehouse B',
      building: 'East Corridor',
      zone: 'Zone C',
      location: 'East corridor',
      bait: 80,
      baitPercent: 80,
      battery: 95,
      batteryPercent: 95,
      status: 'offline',
      statusLabel: 'Offline',
      alertBadge: 'OFFLINE',
      temperature: '21.5°C',
      humidity: '46%',
      lastActivity: '10 Oct, 09:00 AM',
      detects: 0,
      aiConfidence: 'Unknown',
      cameraActive: false,
      connectivity: 'offline',
      wifiName: '',
      notifications: { rodent: true, offline: true, tamper: true, bait: true },
    },
  ],
}

/** Retrieve all stations from localStorage fallback to mock */
export function getPersistedStations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Ignore corrupt localStorage data and fall back to mock
  }
  return MOCK_STATIONS_DATA.stations
}

/** Save stations array to localStorage */
export function savePersistedStations(stations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))
  } catch {
    // Ignore write error — telemetry continues in-memory
  }
}

/** Fetch stations API payload - Ready for Backend HTTP REST Endpoint */
export const fetchStationsData = async () => {
  // 1. Try fetching from Backend Server if available
  const serverData = await apiClient.get('/stations');
  if (serverData) {
    return serverData;
  }

  // 2. Fallback to persisted database / mock payload
  return new Promise((resolve) => {
    setTimeout(() => {
      const stations = getPersistedStations()
      resolve({
        summary: {
          ...MOCK_STATIONS_DATA.summary,
          totalStations: stations.length,
          activeStations: stations.filter((s) => s.status === 'online' || s.status === 'active').length,
          pendingRefills: stations.filter((s) => s.bait < 25).length,
          stationsOffline: stations.filter((s) => s.status === 'offline').length,
        },
        stations,
      })
    }, 200)
  })
}

/** Add a new station - Ready for Backend HTTP POST Endpoint */
export async function addStation(stationReq) {
  // 1. Try sending to Backend Server
  const serverRes = await apiClient.post('/stations', stationReq);
  if (serverRes) {
    return serverRes;
  }

  // 2. Fallback to local database update
  await new Promise((r) => setTimeout(r, 400))
  const stations = getPersistedStations()

  const code = stationReq.stationId || stationReq.code || `RB-${String(stations.length + 1).padStart(2, '0')}`

  const newStation = {
    id: code,
    code,
    stationId: code,
    facility: stationReq.site || stationReq.facility || 'Warehouse A',
    warehouse: stationReq.site || stationReq.facility || 'Warehouse A',
    building: stationReq.site || 'Warehouse A',
    zone: stationReq.zone || 'Zone A',
    location: stationReq.stationName || stationReq.location || `${stationReq.zone} Station`,
    fullAddress: `${stationReq.stationName} - ${stationReq.zone}`,
    bait: 100,
    baitPercent: 100,
    battery: 100,
    batteryPercent: 100,
    status: 'active',
    statusLabel: 'Online',
    alertBadge: 'ONLINE',
    temperature: '22.0°C',
    humidity: '45%',
    lastActivity: 'Just now',
    detects: 0,
    aiConfidence: 'Clear - 100% AI',
    cameraActive: true,
    connectivity: stationReq.connectivity || 'wifi',
    wifiName: stationReq.wifiName || '',
    notifications: stationReq.notifications || { rodent: true, offline: true, tamper: true, bait: true },
  }

  stations.unshift(newStation)
  savePersistedStations(stations)
  return newStation
}

/** Update an existing station - Ready for Backend HTTP PUT Endpoint */
export async function updateStation(id, stationReq) {
  // 1. Try updating on Backend Server
  const serverRes = await apiClient.put(`/stations/${id}`, stationReq);
  if (serverRes) {
    return serverRes;
  }

  // 2. Fallback to local database update
  await new Promise((r) => setTimeout(r, 350))
  const stations = getPersistedStations()

  const index = stations.findIndex((s) => s.id === id || s.code === id)
  if (index === -1) {
    throw new Error(`Station "${id}" not found.`)
  }

  const updated = {
    ...stations[index],
    location: stationReq.stationName || stationReq.location || stations[index].location,
    warehouse: stationReq.warehouse || stationReq.site || stations[index].warehouse,
    facility: stationReq.warehouse || stationReq.site || stations[index].facility,
    zone: stationReq.zone || stations[index].zone,
    connectivity: stationReq.connectivity || stations[index].connectivity,
    wifiName: stationReq.wifiName !== undefined ? stationReq.wifiName : stations[index].wifiName,
    notifications: stationReq.notifications || stations[index].notifications,
  }

  stations[index] = updated
  savePersistedStations(stations)
  return updated
}

/** Delete a station by ID - Ready for Backend HTTP DELETE Endpoint */
export async function deleteStation(id) {
  // 1. Try deleting on Backend Server
  const serverRes = await apiClient.delete(`/stations/${id}`);
  if (serverRes) {
    return serverRes;
  }

  // 2. Fallback to local database delete
  await new Promise((r) => setTimeout(r, 350))
  let stations = getPersistedStations()

  const initialCount = stations.length
  stations = stations.filter((s) => s.id !== id && s.code !== id)

  if (stations.length === initialCount) {
    throw new Error(`Station "${id}" not found.`)
  }

  savePersistedStations(stations)
  return { success: true, deletedId: id }
}
