import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserSession, login, logout } from "@src/api/authApi";
import axios from "axios";
import { UserRole } from "@src/types/roles";

// Check if window is defined (browser) or not (server)
const isBrowser = typeof window !== "undefined";

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  setAuth: (role: UserRole | null) => void;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; role?: UserRole | null; error?: unknown }>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      role: null,

      setAuth: (role) => {
        set({ role, isAuthenticated: !!role });
        // Dispatch storage event to sync across tabs (only in browser)
        if (isBrowser) {
          window.dispatchEvent(new Event("storage"));
        }
      },

      login: async (username: string, password: string) => {
        try {
          const response = await login({
            username: username,
            password: password,
          });

          set({
            isAuthenticated: !!response.role,
            role: response.role,
          });

          // Sync across tabs (only in browser)
          if (isBrowser) {
            window.dispatchEvent(new Event("storage"));
          }

          return { success: true, role: response.role };
        } catch (error) {
          console.error("Login error:", error);
          // Extract the error message from the Axios error response
          let errorMessage = "Login failed";

          if (axios.isAxiosError(error) && error.response?.data) {
            // Try to get the error message from the response data
            errorMessage =
              error.response.data.non_field_errors || "Invalid credentials";
          }

          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          // First update the local state
          set({ isAuthenticated: false, role: null });

          // Then attempt the API call, but don't depend on its success
          await logout().catch((error) => {
            console.error("Logout API error:", error);
            // This is non-critical, we've already updated local state
          });

          // Sync across tabs (only in browser)
          if (isBrowser) {
            window.dispatchEvent(new Event("storage"));
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      initializeAuth: async () => {
        const { isAuthenticated, role } = get();

        // If we already have auth state from localStorage, trust it and don't make an API call
        if (isAuthenticated && role) {
          return;
        }

        // Only fetch from API if we don't have state in localStorage
        try {
          const session = await fetchUserSession();
          set({
            role: session.role,
            isAuthenticated: !!session.role,
          });
        } catch {
          set({ isAuthenticated: false, role: null });
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist the role and authentication status, not tokens
      partialize: (state) => ({
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Add the storage event listener for cross-tab sync only in browser environments
if (isBrowser) {
  window.addEventListener("storage", () => {
    const storedState = JSON.parse(
      localStorage.getItem("auth-storage") || "{}"
    );
    if (storedState.state) {
      useAuthStore.setState({
        role: storedState.state.role,
        isAuthenticated: storedState.state.isAuthenticated,
      });
    }
  });
}
