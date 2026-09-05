import { WebSocketServer } from 'ws';
import { store } from '../db/store.js';

class BroadcastEngine {
  constructor() {
    this.wss = null;
    this.clients = new Set();
    this.simulationTimer = null;
  }

  init(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws, req) => {
      this.clients.add(ws);
      console.log(`[WS] Client connected. Total active: ${this.clients.size}`);

      // Send immediate initial sync payload for each channel
      this.sendToClient(ws, 'stations', store.getStations());
      this.sendToClient(ws, 'alerts', store.getAlerts());
      this.sendToClient(ws, 'overview', store.getOverview());
      this.sendToClient(ws, 'facility-map', store.getMap());

      ws.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          }
        } catch {
          // Skip invalid frame
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[WS] Client disconnected. Total active: ${this.clients.size}`);
      });

      ws.on('error', (err) => {
        console.error('[WS] Connection error:', err.message);
        this.clients.delete(ws);
      });
    });

    // Wire data store change listener to broadcast
    store.onDataChange((channel, data) => {
      this.broadcast(channel, data);
    });

    // Start background simulated telemetry if enabled in env
    if (process.env.ENABLE_SIMULATED_TELEMETRY === 'true') {
      this.startSimulatedHeartbeat();
    }
  }

  sendToClient(ws, channel, data) {
    if (ws.readyState === 1 /* OPEN */) {
      ws.send(JSON.stringify({ channel, data, timestamp: new Date().toISOString() }));
    }
  }

  broadcast(channel, data) {
    const payload = JSON.stringify({ channel, data, timestamp: new Date().toISOString() });
    for (const client of this.clients) {
      if (client.readyState === 1 /* OPEN */) {
        client.send(payload);
      }
    }
  }

  startSimulatedHeartbeat() {
    const intervalMs = Number(process.env.TELEMETRY_INTERVAL_MS) || 45000;
    this.simulationTimer = setInterval(() => {
      if (this.clients.size === 0) return;

      const stations = store.stations;
      if (!stations || stations.length === 0) return;

      // Pick random station to fluctuate battery or detect
      const randomIdx = Math.floor(Math.random() * stations.length);
      const station = stations[randomIdx];

      // Subtle heartbeat update
      const updatedBattery = Math.max(10, Math.min(100, station.battery + (Math.random() > 0.5 ? -1 : 1)));
      store.updateStation(station.id, {
        battery: updatedBattery,
        batteryPercent: updatedBattery,
        lastActivity: 'Just now',
      });
    }, intervalMs);
  }

  stop() {
    if (this.simulationTimer) clearInterval(this.simulationTimer);
    if (this.wss) this.wss.close();
  }
}

export const broadcastEngine = new BroadcastEngine();
