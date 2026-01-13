"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Card, CardContent } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { UserRoles } from "@src/types/roles";
import { Routes } from "@src/constants/routes";
import { useAuth } from "@src/providers/AuthProvider";

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, logout, isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();
  const [showUI, setShowUI] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    if (error) {
      console.error("Auth error in RedirectIfAuthenticated:", error);
    }

    if (!isLoading) {
      setShowUI(isAuthenticated ? "authenticated" : "unauthenticated");
    }
  }, [isAuthenticated, isLoading, error]);

  // Show nothing during initial check
  if (showUI === "loading" || isLoading) {
    return <div className="min-h-screen" />;
  }

  // If authenticated, show the user choice UI
  if (showUI === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-md">
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-xl font-semibold">
                You&apos;re already logged in
              </h2>
              <p className="text-muted-foreground">
                Where would you like to go?
              </p>

              <div className="w-full space-y-3 pt-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    router.push(
                      role === UserRoles.STORE
                        ? Routes.STORE.ROOT
                        : Routes.MEMBER.PROFILE
                    )
                  }
                >
                  Go to Dashboard
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    logout();
                    // Force a complete page refresh when logging out
                    window.location.href = Routes.LOGIN;
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
