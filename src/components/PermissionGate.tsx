"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole, UserRoles } from "@src/types/roles";
import { Card, CardContent } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { LogIn } from "lucide-react";
import { Routes } from "@src/constants/routes";

export default function PermissionGate({
  allowedRole,
  children,
}: {
  allowedRole: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showUI, setShowUI] = useState<
    "loading" | "authenticated" | "unauthorized" | "unauthenticated"
  >("loading");
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get auth state from localStorage directly
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        try {
          const parsedData = JSON.parse(authData);
          if (parsedData.state?.isAuthenticated) {
            const role = parsedData.state.role;
            setUserRole(role);

            if (role === allowedRole) {
              setShowUI("authenticated");
            } else {
              setShowUI("unauthorized");
            }
            return;
          }
        } catch (e) {
          console.error("Error parsing auth data:", e);
        }
      }

      // If we get here, user is not authenticated
      setShowUI("unauthenticated");
    }
  }, [allowedRole]);

  // Show nothing during initial check
  if (showUI === "loading") {
    return <div className="min-h-screen" />;
  }

  // If not authenticated, show login prompt
  if (showUI === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-md">
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-xl font-semibold">Sign in required</h2>
              <p className="text-muted-foreground">
                Please sign in to continue to this page.
              </p>

              <Button
                className="w-full mt-4"
                onClick={() => router.push(Routes.LOGIN)}
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated but wrong role
  if (showUI === "unauthorized") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-md">
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-xl font-semibold">Access restricted</h2>
              <p className="text-muted-foreground">
                This area is only accessible to {allowedRole}s.
              </p>

              <Button
                className="w-full mt-4"
                variant="secondary"
                onClick={() =>
                  router.push(
                    userRole === UserRoles.MEMBER
                      ? Routes.MEMBER.PROFILE
                      : Routes.STORE.DASHBOARD
                  )
                }
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated with correct role, show the children
  return children;
}
