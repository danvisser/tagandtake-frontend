import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchUserSession, login, logout } from "@src/api/authApi";
import { setAccessToken } from "@src/lib/fetchClient";
import axios from "axios";
import { UserRole } from "@src/types/roles";

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  accessToken: string | null;
  initializationStatus: "idle" | "loading" | "completed" | "error";
  error: Error | null;
  setAuth: (role: UserRole | null, token: string | null) => void;
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
      accessToken: null,
      initializationStatus: "idle",
      error: null,

      setAuth: (role, token) => {
        setAccessToken(token);
        set({
          role,
          accessToken: token,
          isAuthenticated: !!role,
          initializationStatus: "completed",
        });
      },

      initializeAuth: async () => {
        // Don't re-initialize if already completed
        if (get().initializationStatus === "completed") {
          return;
        }

        set({ initializationStatus: "loading", error: null });

        try {
          const session = await fetchUserSession();
          setAccessToken(session.access);
          set({
            role: session.user.role,
            accessToken: session.access,
            isAuthenticated: !!session.user.role,
            initializationStatus: "completed",
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            role: null,
            accessToken: null,
            initializationStatus: "error",
            error:
              error instanceof Error
                ? error
                : new Error("Authentication failed"),
          });
        }
      },

      login: async (username: string, password: string) => {
        try {
          const response = await login({
            username: username,
            password: password,
          });

          setAccessToken(response.access);
          set({
            isAuthenticated: !!response.user.role,
            role: response.user.role,
            accessToken: response.access,
            initializationStatus: "completed",
            error: null,
          });

          return { success: true, role: response.user.role };
        } catch (error) {
          console.error("Login error:", error);
          let errorMessage = "Login failed";

          if (axios.isAxiosError(error) && error.response?.data) {
            errorMessage =
              error.response.data.non_field_errors || "Invalid credentials";
          }

          set({ error: new Error(errorMessage) });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await logout();
          // Clear the token
          setAccessToken(null);
          set({
            isAuthenticated: false,
            role: null,
            accessToken: null,
            initializationStatus: "idle",
            error: null,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({
            error: error instanceof Error ? error : new Error("Logout failed"),
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        initializationStatus: state.initializationStatus,
      }),
    }
  )
);

// Subscribe to store changes to sync fetchClient token
// When the store updates (including from cross-tab sync), update fetchClient's in-memory token
if (typeof window !== "undefined") {
  let prevToken: string | null = useAuthStore.getState().accessToken;
  useAuthStore.subscribe((state) => {
    // Only update fetchClient if accessToken actually changed
    if (state.accessToken !== prevToken) {
      prevToken = state.accessToken;
      setAccessToken(state.accessToken);
    }
  });

  // Enable cross-tab sync: listen for storage events and rehydrate the store
  // This is required because Zustand's persist middleware doesn't automatically
  // listen to storage events - it only persists, it doesn't sync across tabs
  const storageName = useAuthStore.persist.getOptions().name;

  const handleStorageChange = (e: StorageEvent) => {
    // Only react to changes in our auth storage key
    if (e.key === storageName) {
      // Rehydrate the store from localStorage, which will trigger React re-renders
      // This handles both login (e.newValue !== null) and logout (e.newValue === null)
      useAuthStore.persist.rehydrate();
    }
  };

  window.addEventListener("storage", handleStorageChange);
}
