"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectAccountManagement,
  ConnectBalances,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import tailwindConfig from "../../../../tailwind.config";
import {
  getPaymentAccountStatus,
  createOnboardingSession,
  createAccountManagementSession,
  createPayoutsSession,
} from "@src/api/paymentsApi";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { Alert, AlertDescription } from "@src/components/ui/alert";
import { Button } from "@src/components/ui/button";
import { AlertCircle, CreditCard } from "lucide-react";

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  const [isReinitializing, setIsReinitializing] = useState(false);

  // Check account status on mount
  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getPaymentAccountStatus();
        if (response.success && response.data) {
          setIsOnboarded(response.data.onboarded);
        } else {
          setError(response.error || "Failed to check account status");
        }
      } catch (err) {
        console.error("Error checking account status:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  // Create fetchClientSecret function based on onboarding status and view mode
  const fetchClientSecret = useMemo(() => {
    return async () => {
      if (isOnboarded === null) {
        throw new Error("Account status not yet determined");
      }

      if (!isOnboarded) {
        const response = await createOnboardingSession();
        if (response.success && response.data?.client_secret) {
          return response.data.client_secret;
        } else {
          throw new Error(
            response.error || "Failed to create onboarding session"
          );
        }
      }

      // If onboarded, use balances session for balance view, management for management view
      const response = showManagement
        ? await createAccountManagementSession()
        : await createPayoutsSession();

      if (response.success && response.data?.client_secret) {
        return response.data.client_secret;
      } else {
        throw new Error(
          response.error ||
          `Failed to create ${showManagement ? "management" : "balances"} session`
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnboarded, showManagement, viewKey]);

  // Initialize Stripe Connect instance - recreate when showManagement changes
  const connectInstance = useMemo(() => {
    if (isOnboarded === null || isReinitializing) {
      return null;
    }

    const theme = tailwindConfig.theme.extend;
    const colors = theme.colors;
    const backgroundColor = theme.backgroundColor;
    const textColor = theme.TextColor;
    const fontFamily = theme.fontFamily.sans.join(", ");
    const mutedForeground = "hsl(0, 0%, 50%)";

    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret: fetchClientSecret,
      appearance: {
        variables: {
          fontFamily,
          colorPrimary: colors.primary.DEFAULT,
          colorBackground: backgroundColor.DEFAULT,
          colorText: textColor.DEFAULT,
          colorDanger: colors.destructive.DEFAULT,
          colorBorder: mutedForeground,
          borderRadius: "8px",
          buttonPrimaryColorBackground: colors.primary.DEFAULT,
          buttonPrimaryColorBorder: colors.primary.DEFAULT,
          buttonPrimaryColorText: colors.primary.foreground,
          buttonSecondaryColorBackground: backgroundColor.secondary,
          buttonSecondaryColorBorder: mutedForeground,
          buttonSecondaryColorText: colors.secondary.foreground,
          formAccentColor: colors.primary.DEFAULT,
          formHighlightColorBorder: mutedForeground,
          actionPrimaryColorText: colors.primary.DEFAULT,
        },
      },
    });
  }, [isOnboarded, fetchClientSecret, isReinitializing]);

  // Show loading state while checking status
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading payment account..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !connectInstance) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-normal">Your Earnings</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show embedded component
  if (!connectInstance) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner
            size="lg"
            text={
              isOnboarded
                ? "Loading account management..."
                : "Preparing onboarding..."
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-normal min-w-0">
            {isOnboarded && showManagement
              ? "Payment Settings"
              : "Your Earnings"}
          </h1>
          {isOnboarded && !showManagement && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsReinitializing(true);
                setViewKey((prev) => prev + 1);
                setShowManagement(true);
                // Reset after a tick to allow re-render
                setTimeout(() => setIsReinitializing(false), 0);
              }}
              className="text-muted-foreground hover:text-foreground border-muted-foreground shrink-0"
            >
              <CreditCard className="h-4 w-4" />
              Manage account
            </Button>
          )}
          {isOnboarded && showManagement && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsReinitializing(true);
                setViewKey((prev) => prev + 1);
                setShowManagement(false);
                // Reset after a tick to allow re-render
                setTimeout(() => setIsReinitializing(false), 0);
              }}
              className="text-muted-foreground hover:text-foreground border-muted-foreground shrink-0"
            >
              Back to balance
            </Button>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-0 -mx-4 px-4">
          <ConnectComponentsProvider
            key={`${showManagement ? "management" : "balance"}-${viewKey}`}
            connectInstance={connectInstance}
          >
            <div className="[&_div]:!pr-0 [&_div]:!pb-0 [&_iframe]:!pr-0 [&_iframe]:!pb-0">
              {isOnboarded ? (
                showManagement ? (
                  <ConnectAccountManagement />
                ) : (
                  <ConnectBalances />
                )
              ) : (
                <ConnectAccountOnboarding
                  onExit={() => {
                    // Refresh status when user exits onboarding
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </ConnectComponentsProvider>
        </div>
      </div>
    </div>
  );
}
