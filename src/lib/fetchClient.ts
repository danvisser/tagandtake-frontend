import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  refreshAccessToken,
  AuthErrorResponse,
  fetchUserSession,
} from "@src/api/authApi";
import { handleSessionExpiration } from "@src/lib/sessionExpirationHandler";
import { useAuthStore } from "@src/stores/authStore";
import { UserRole } from "@src/types/roles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const API_BASE_URL = `${API_URL}/${API_VERSION}`;

// Configuration constants
const REQUEST_TIMEOUT = 15000; // 15 seconds for regular requests
const REFRESH_TIMEOUT = 5000; // 5 seconds for token refresh operations

// In-memory storage for the access token
// This is kept in sync with Zustand store via subscription
let accessToken: string | null = null;

// Initialize token from Zustand store if available (only in browser)
if (typeof window !== "undefined") {
  try {
    const store = useAuthStore.getState();
    accessToken = store.accessToken;
  } catch (e) {
    console.error("Error accessing auth store:", e);
  }
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Update the in-memory token
// Note: The Zustand store is the source of truth, and this function
// is called when the store updates (via subscription in authStore.ts)
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

// Helper function to extract user context from various response structures
const extractUserContext = (
  responseData: unknown
): { role: UserRole | null; id?: number } | null => {
  if (
    responseData &&
    typeof responseData === "object" &&
    "user" in responseData &&
    responseData.user &&
    typeof responseData.user === "object" &&
    "role" in responseData.user
  ) {
    const user = responseData.user as { role: UserRole; id?: number };
    return { role: user.role, id: user.id };
  }
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    responseData.data &&
    typeof responseData.data === "object" &&
    "user" in responseData.data &&
    responseData.data.user &&
    typeof responseData.data.user === "object" &&
    "role" in responseData.data.user
  ) {
    const user = responseData.data.user as { role: UserRole; id?: number };
    return { role: user.role, id: user.id };
  }
  return null;
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

// Response interceptor to handle token refresh and sync auth state
fetchClient.interceptors.response.use(
  (response) => {
    const isAuthRequest = response.config?.withCredentials === true;

    if (!isAuthRequest) {
      const userContext = extractUserContext(response.data);
      if (userContext?.role) {
        const store = useAuthStore.getState();
        if (store.accessToken && store.role !== userContext.role) {
          store.setAuth(userContext.role, store.accessToken);
        }
      }
    }
    return response;
  },
  async (error: AxiosError<AuthErrorResponse>) => {
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
          const store = useAuthStore.getState();
          const userRole = response.user?.role || null;

          if (userRole) {
            // setAuth will call setAccessToken internally
            store.setAuth(userRole, newToken);
          } else {
            try {
              const session = await fetchUserSession();
              store.setAuth(session.user.role, newToken);
            } catch {
              store.setAuth(store.role, newToken);
            }
          }

          onTokenRefreshed(newToken);

          // Token is now in Zustand store and will be available via accessToken variable
          // (setAuth already called setAccessToken)
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

    // When handling errors
    if (error.response?.data) {
      // Return the original error response data
      return Promise.reject(error);
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
