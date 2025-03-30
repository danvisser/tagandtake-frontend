"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@src/stores/authStore";
import { UserRole } from "@src/types/roles";

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuthentication = async () => {
      try {
        // Get fresh store state to avoid closure issues
        const store = useAuthStore.getState();
        await store.initializeAuth();
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err : new Error("Auth initialization failed")
        );
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    initializeAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  // Update local error state when store error changes
  useEffect(() => {
    setError(store.error);
  }, [store.error]);

  // Create a login handler that matches the AuthContextType signature
  const handleLogin = async (
    username: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      const result = await store.login(username, password);
      if (!result.success) {
        return {
          success: false,
          error: result.error?.toString() || "Login failed",
        };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: store.isAuthenticated,
        role: store.role,
        isLoading: isLoading || store.initializationStatus === "loading",
        error,
        login: handleLogin, // Use the handler instead of store.login directly
        logout: store.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
