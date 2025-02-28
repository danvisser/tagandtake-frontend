import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@src/api/authApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const API_BASE_URL = `${API_URL}/${API_VERSION}`;

// In-memory storage for the access token
let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Function to subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to notify subscribers about new token
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

export const fetchClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add the token to requests
fetchClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
fetchClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, wait for the new token
        try {
          const newToken = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((token: string) => {
              resolve(token);
            });
          });

          // Retry the original request with the new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return fetchClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start refreshing the token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAccessToken();
        const newToken = response.access || null;
        setAccessToken(newToken);
        if (newToken) {
          onTokenRefreshed(newToken);
        }

        // Retry the original request with the new token
        originalRequest.headers = originalRequest.headers || {};
        if (newToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }
        isRefreshing = false;
        return fetchClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // If refresh fails, clear token and reject
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authRequest = (config: AxiosRequestConfig) => {
  return fetchClient({
    ...config,
    withCredentials: true,
  });
};
