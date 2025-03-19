"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/providers/AuthProvider";
import { UserRoles } from "@src/types/roles";
import { Routes } from "@src/constants/routes";
import LoadingUI from "@src/components/LoadingUI";

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect based on role
      if (role === UserRoles.MEMBER) {
        router.push(Routes.MEMBER.PROFILE);
        router.refresh();
      } else if (role === UserRoles.STORE) {
        router.push(Routes.STORE.DASHBOARD);
        router.refresh();
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  // Show loading state while checking authentication or if authenticated
  if (isLoading || isAuthenticated) {
    return <LoadingUI />;
  }

  // Only show children if not authenticated
  return children;
}
