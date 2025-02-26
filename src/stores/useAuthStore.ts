import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserSession } from "@src/api/authApi";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  setAuth: (role: string | null) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      role: null,

      setAuth: (role) => set({ role, isAuthenticated: !!role }),

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
            role: session.user.role,
            isAuthenticated: !!session.user.role,
          });
        } catch {
          set({ isAuthenticated: false, role: null });
        }
      },
    }),
    { name: "auth-storage" }
  )
);
