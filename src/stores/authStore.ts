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
  isLoading: boolean;
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
    (set) => ({
      isAuthenticated: false,
      role: null,
      isLoading: true,

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
            isLoading: false,
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
          await logout();
          set({ isAuthenticated: false, role: null, isLoading: false });
          // Sync across tabs (only in browser)
          if (isBrowser) {
            window.dispatchEvent(new Event("storage"));
          }
          // Force a re-render of components using the auth state
          window.dispatchEvent(new Event("auth-state-changed"));
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      initializeAuth: async () => {
        try {
          const response = await fetchUserSession();
          set({
            isAuthenticated: !!response.role,
            role: response.role,
            isLoading: false,
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ isAuthenticated: false, role: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
      // Only persist these fields
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        role: state.role,
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
        isLoading: false,
      });
    }
  });
}
