import { BACKEND_CONFIG } from './config';

/**
 * Standardized HTTP & Real-time Client Manager
 * 
 * Provides unified GET, POST, PUT, DELETE operations with automatic header injection,
 * token authorization, error handling, and real-time WebSocket subscription fallback.
 */

class ApiClient {
  constructor() {
    this.baseUrl = BACKEND_CONFIG.baseUrl;
    this.listeners = new Map();
    this.ws = null;
  }

  /** Retrieve current auth token */
  getToken() {
    try {
      const storedUser = localStorage.getItem('baitguard_user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        return userObj.token || 'mock_bearer_token';
      }
      return localStorage.getItem(BACKEND_CONFIG.tokenKey) || null;
    } catch {
      return null;
    }
  }

  /** Default Request Headers */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /** Universal GET Request */
  async get(endpoint, params = {}) {
    if (!BACKEND_CONFIG.enableRealBackend) {
      return null; // Signals wrapper to use mock/persisted fallback
    }

    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API GET Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  /** Universal POST Request */
  async post(endpoint, data = {}) {
    if (!BACKEND_CONFIG.enableRealBackend) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API POST Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  /** Universal PUT Request */
  async put(endpoint, data = {}) {
    if (!BACKEND_CONFIG.enableRealBackend) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const msg = body?.message || body?.error || `API PUT Error: ${response.status}`;
        const err = new Error(msg);
        err.status = response.status;
        err.body = body;
        throw err;
      }

      return body;
    } catch (err) {
      console.warn(`[ApiClient] PUT ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  /** Universal PATCH Request */
  async patch(endpoint, data = {}) {
    if (!BACKEND_CONFIG.enableRealBackend) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const msg = body?.message || body?.error || `API PATCH Error: ${response.status}`;
        const err = new Error(msg);
        err.status = response.status;
        err.body = body;
        throw err;
      }

      return body;
    } catch (err) {
      console.warn(`[ApiClient] PATCH ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  /** Universal DELETE Request */
  async delete(endpoint) {
    if (!BACKEND_CONFIG.enableRealBackend) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API DELETE Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Subscribe to Real-Time Telemetry Updates
   * 
   * Connects via WebSockets when real backend is configured,
   * otherwise falls back to smart background polling.
   */
  subscribe(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel).add(callback);

    // If Real Backend WebSockets are active
    if (BACKEND_CONFIG.enableRealBackend && typeof WebSocket !== 'undefined') {
      this.connectWebSocket();
    }

    // Return cleanup unsubscribe function
    return () => {
      const channelListeners = this.listeners.get(channel);
      if (channelListeners) {
        channelListeners.delete(callback);
      }
    };
  }

  connectWebSocket() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(BACKEND_CONFIG.wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const channel = payload.channel || 'telemetry';
          const callbacks = this.listeners.get(channel);
          if (callbacks) {
            callbacks.forEach((cb) => cb(payload.data));
          }
        } catch {
          // Malformed WS message — skip silently
        }
      };

      this.ws.onerror = () => {
        // WS connection error — auto-reconnect handled in onclose
      };

      this.ws.onclose = () => {
        // Auto-reconnect after 5 seconds
        setTimeout(() => this.connectWebSocket(), 5000);
      };
    } catch {
      // WS unavailable — real-time updates disabled
    }
  }
}

export const apiClient = new ApiClient();
