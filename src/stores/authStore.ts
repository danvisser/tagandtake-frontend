import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserSession, login, logout } from "@src/api/authApi";
import { getAccessToken } from "@src/lib/fetchClient";
import axios from "axios";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  setAuth: (role: string | null) => void;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; role?: string | null; error?: unknown }>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      role: null,

      setAuth: (role) => set({ role, isAuthenticated: !!role }),

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

          return { success: true, role: response.role };
        } catch (error) {
          console.error("Login error:", error);
          // Extract the error message from the Axios error response
          let errorMessage = "Login failed";

          if (axios.isAxiosError(error) && error.response?.data) {
            // Try to get the error message from the response data
            errorMessage =
              error.response.data.non_field_errors ||
              "Invalid credentials";
          }

          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await logout();
          set({ isAuthenticated: false, role: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      initializeAuth: async () => {
        const { isAuthenticated, role } = get();

        // If we already have auth state and an access token, no need to re-fetch
        if (isAuthenticated && role && getAccessToken()) {
          return;
        }

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
