import { useState, useEffect, useCallback } from "react";
import { itemPurchased, ItemPurchasedResponse } from "@src/api/paymentsApi";

interface UsePurchaseStatusProps {
  sessionId: string | null;
}

export function usePurchaseStatus({
  sessionId,
}: UsePurchaseStatusProps) {
  const [purchaseData, setPurchaseData] =
    useState<ItemPurchasedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Function to check status
  const checkStatus = useCallback(async () => {
    if (!sessionId) {
      setError("No session ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const result = await itemPurchased({
        session_id: sessionId,
        _t: timestamp, // Add a timestamp parameter to prevent caching
      });

      if (result.success && result.data) {
        setPurchaseData(result.data);
      } else {
        setError(result.error || "Failed to fetch purchase status");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Check on mount and when refresh is triggered
  useEffect(() => {
    checkStatus();
  }, [checkStatus, refreshCounter]);

  // Function to force a refresh
  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return {
    purchaseData,
    isLoading,
    error,
    refresh,
  };
}
