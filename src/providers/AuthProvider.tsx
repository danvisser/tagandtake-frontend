"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuthStore } from "@src/stores/authStore";
import { UserRole } from "@src/types/roles";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, role, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [initializeAuth]);

  // Use the latest store state for the context value
  const contextValue = {
    isAuthenticated,
    role,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
