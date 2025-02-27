import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserSession, login } from "@src/api/authApi";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  setAuth: (role: string | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; role?: string; error?: unknown }>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      role: null,

      setAuth: (role) => set({ role, isAuthenticated: !!role }),

      login: async (email: string, password: string) => {
        try {
          const response = await login({ email, password });
          set({ isAuthenticated: true, role: response.role });
          return { success: true, role: response.role };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, error };
        }
      },

      logout: () => {
        set({ isAuthenticated: false, role: null });
        localStorage.removeItem("auth-storage");
      },

      initializeAuth: async () => {
        const { isAuthenticated, role } = get();

        if (isAuthenticated && role) {
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
    { name: "auth-storage" }
  )
);
