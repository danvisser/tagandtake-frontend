"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { SuccessState } from "./components/SuccessState";
import { ErrorState } from "./components/ErrorState";
import { ExpiredState } from "./components/ExpiredState";
import { NotFoundState } from "./components/NotFoundState";
import { PendingState } from "./components/PendingState";
import { Routes } from "@src/constants/routes";
import { usePurchaseStatus } from "./hooks/usePurchaseStatus";

// Wrapper component for all states
const StateWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[90%] sm:max-w-md mx-auto">{children}</div>
    </div>
  );
};

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { purchaseData, isLoading, error, refresh } = usePurchaseStatus({
    sessionId,
  });

  const handleGoHome = () => {
    router.push(Routes.HOME);
  };

  // Redirect to home if no session ID
  if (!sessionId) {
    router.push(Routes.HOME);
    return null;
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <StateWrapper>
        <LoadingSpinner />
      </StateWrapper>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <StateWrapper>
        <ErrorState onRetry={refresh} onGoHome={handleGoHome} />
      </StateWrapper>
    );
  }

  // Handle different purchase states
  switch (purchaseData?.status) {
    case "complete":
      return (
        <StateWrapper>
          <SuccessState purchaseData={purchaseData} onGoHome={handleGoHome} />
        </StateWrapper>
      );

    case "pending":
    case "processing":
    case "requires_action":
      return (
        <StateWrapper>
          <PendingState onGoHome={handleGoHome} onRetry={refresh} />
        </StateWrapper>
      );

    case "canceled":
      return (
        <StateWrapper>
          <ErrorState onRetry={refresh} onGoHome={handleGoHome} />
        </StateWrapper>
      );

    case "expired":
      return (
        <StateWrapper>
          <ExpiredState onGoHome={handleGoHome} onRetry={refresh} />
        </StateWrapper>
      );

    case "not_found":
      return (
        <StateWrapper>
          <NotFoundState onGoHome={handleGoHome} onRetry={refresh} />
        </StateWrapper>
      );

    default:
      return (
        <StateWrapper>
          <ErrorState onRetry={refresh} onGoHome={handleGoHome} />
        </StateWrapper>
      );
  }
}
