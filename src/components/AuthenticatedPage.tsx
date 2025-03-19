"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/providers/AuthProvider";
import { UserRole } from "@src/types/roles";
import { Routes } from "@src/constants/routes";
import LoadingUI from "@src/components/LoadingUI";

interface AuthenticatedPageProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function AuthenticatedPage({
  children,
  requiredRole,
}: AuthenticatedPageProps) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Save current path for return after login
        sessionStorage.setItem("returnPath", window.location.pathname);
        router.replace(Routes.LOGIN);
      } else if (requiredRole && role !== requiredRole) {
        // Redirect to appropriate dashboard if wrong role
        router.replace(
          role === "member" ? Routes.MEMBER.PROFILE : Routes.STORE.DASHBOARD
        );
      }
    }
  }, [isLoading, isAuthenticated, role, requiredRole, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <LoadingUI />;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If wrong role, don't render anything (redirect will happen)
  if (requiredRole && role !== requiredRole) {
    return null;
  }

  // If authenticated with correct role, render children
  return <>{children}</>;
}
