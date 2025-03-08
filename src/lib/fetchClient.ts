import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@src/api/authApi";
import { handleSessionExpiration } from "@src/lib/sessionExpirationHandler";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const API_BASE_URL = `${API_URL}/${API_VERSION}`;

// Configuration constants
const REQUEST_TIMEOUT = 15000; // 15 seconds for regular requests
const REFRESH_TIMEOUT = 5000; // 5 seconds for token refresh operations

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
  timeout: REQUEST_TIMEOUT, // Set default timeout for all requests
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
        // If already refreshing, wait for the result with a shorter timeout
        try {
          const newToken = await Promise.race([
            new Promise<string>((resolve) => {
              subscribeTokenRefresh((token: string) => {
                resolve(token);
              });
            }),
            new Promise<never>((_, reject) => {
              setTimeout(() => {
                reject(new Error("Token refresh timeout"));
              }, REFRESH_TIMEOUT);
            }),
          ]);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return fetchClient(originalRequest);
        } catch (refreshError) {
          // Handle session expiration immediately
          handleSessionExpiration();
          return Promise.reject(refreshError);
        }
      }

      // Start refreshing the token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use Promise.race to add timeout to the refresh token request
        const response = await Promise.race([
          refreshAccessToken(),
          new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error("Token refresh request timeout"));
            }, REFRESH_TIMEOUT);
          }),
        ]);

        const newToken = response.access || null;

        if (newToken) {
          setAccessToken(newToken);
          onTokenRefreshed(newToken);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          isRefreshing = false;
          return fetchClient(originalRequest);
        } else {
          throw new Error("No token received during refresh");
        }
      } catch (refreshError) {
        isRefreshing = false;

        // Handle session expiration
        handleSessionExpiration();

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
