import axios from "axios";

/**
 * Shared Axios client for Liver Cirrhosis Risk Prediction System.
 * Adheres to:
 * - Environment-based API URL via VITE_API_BASE_URL (never hard-coded).
 * - Attaches Bearer token from in-memory state.
 * - Centralized 401 handling to automatically log out unauthenticated sessions.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

let inMemoryToken = null;
let logoutCallback = null;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/**
 * Sets or clears the in-memory token for authenticated API requests.
 * @param {string|null} token
 */
export function setClientAuthToken(token) {
  inMemoryToken = token;
}

/**
 * Registers a callback invoked whenever the backend returns 401 Unauthorized.
 * @param {Function} cb
 */
export function registerUnauthorizedHandler(cb) {
  logoutCallback = cb;
}

// Request Interceptor: Attach in-memory JWT bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Intercept 401 responses to invalidate state
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      inMemoryToken = null;
      if (typeof logoutCallback === "function") {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

