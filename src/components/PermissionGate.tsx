"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@src/providers/AuthProvider";
import { UserRole, UserRoles } from "@src/types/roles";
import { Card, CardContent } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { LogIn } from "lucide-react";
import { Routes } from "@src/constants/routes";
import LoadingUI from "@src/components/LoadingUI";

export default function PermissionGate({
  allowedRole,
  children,
}: {
  allowedRole: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role, isLoading } = useAuth();

  // Show loading skeleton during initial check
  if (isLoading) {
    return <LoadingUI />;
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
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
                onClick={() => {
                  // Store the current path as the return path
                  sessionStorage.setItem(
                    "returnPath",
                    window.location.pathname
                  );
                  router.push(Routes.LOGIN);
                }}
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
  if (role !== allowedRole) {
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
                    role === UserRoles.MEMBER
                      ? Routes.MEMBER.PROFILE
                      : Routes.STORE.ROOT
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
