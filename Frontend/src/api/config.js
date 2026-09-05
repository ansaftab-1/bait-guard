/**
 * Centralized API & Backend Configuration
 * 
 * Configured for seamless communication with Bait Guard Express Backend & WebSocket Engine.
 */

export const BACKEND_CONFIG = {
  // Base HTTP URL for REST endpoints
  baseUrl: import.meta.env?.VITE_API_BASE_URL || '/api',

  // WebSocket URL for real-time telemetry streaming
  wsUrl:
    import.meta.env?.VITE_WS_URL ||
    (typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? `wss://${window.location.host}/ws`
      : 'ws://localhost:5000/ws'),

  // Master switch for toggling between Real Backend & Mock DB
  enableRealBackend: import.meta.env?.VITE_ENABLE_REAL_BACKEND !== 'false',

  // Auto-polling interval for real-time telemetry (ms)
  pollIntervalMs: 15000,

  // Storage key for authentication token
  tokenKey: 'baitguard_auth_token',
};
