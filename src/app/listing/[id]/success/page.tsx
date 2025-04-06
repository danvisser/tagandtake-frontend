"use client";

import { itemPurchased } from "@src/api/paymentsApi";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import { Routes } from "@src/constants/routes";
import LoadingSpinner from "@src/components/LoadingSpinner";

// Define possible status types
type PurchaseStatus =
  | "loading"
  | "success"
  | "pending"
  | "error"
  | "not_found"
  | "expired";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PurchaseStatus>("loading");
  const [itemName, setItemName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          setStatus("error");
          setError("No session ID provided");
          return;
        }

        const result = await itemPurchased({ session_id: sessionId });

        if (result.error) {
          // Handle different error cases based on the error message or status code
          if (
            result.error.includes("404") ||
            result.error.includes("not found")
          ) {
            setStatus("not_found");
            setError("The purchase session could not be found");
          } else if (
            result.error.includes("410") ||
            result.error.includes("expired")
          ) {
            setStatus("expired");
            setError("The purchase confirmation has expired");
          } else {
            setStatus("error");
            setError(result.error);
          }
        } else if (result.data) {
          // Handle different success cases
          if (result.data.status === "complete") {
            setStatus("success");
            setItemName(result.data.item?.name || null);
            setMessage(
              result.data.message || "Purchase completed successfully"
            );
          } else {
            setStatus("pending");
            setMessage(
              result.data.message || "Your payment is being processed"
            );

            // If pending and we haven't exceeded max retries, retry after a delay
            if (retryCount < maxRetries) {
              setTimeout(() => {
                setRetryCount((prev) => prev + 1);
              }, 5000); // Retry every 5 seconds
            }
          }
        }
      } catch (error) {
        console.error("Error fetching purchase data:", error);
        setStatus("error");
        setError("An error occurred while fetching purchase data");
      }
    };

    fetchData();
  }, [searchParams, retryCount]);

  // Handle retry button click
  const handleRetry = () => {
    setRetryCount(0);
    setStatus("loading");
  };

  // Handle navigation back to home
  const handleGoHome = () => {
    router.push(Routes.HOME);
  };

  // Render different UI based on status
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner size="lg" text="Checking purchase status..." />
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
            {itemName && (
              <p className="text-lg mb-2">
                You have successfully purchased:{" "}
                <span className="font-semibold">{itemName}</span>
              </p>
            )}
            {message && <p className="text-muted-foreground mb-6">{message}</p>}
            <Button onClick={handleGoHome} className="mt-4">
              Return to Home
            </Button>
          </div>
        );

      case "pending":
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <Clock className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Processing</h2>
            <p className="text-muted-foreground mb-6">
              {message ||
                "Your payment is being processed. This may take a few moments."}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;ll automatically check the status. You can also check
              manually.
            </p>
            <Button onClick={handleRetry} variant="outline" className="mt-2">
              Check Status Again
            </Button>
          </div>
        );

      case "not_found":
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error ||
                "The purchase session could not be found. It may have expired or been invalid."}
            </p>
            <Button onClick={handleGoHome} className="mt-4">
              Return to Home
            </Button>
          </div>
        );

      case "expired":
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Purchase Expired</h2>
            <p className="text-muted-foreground mb-6">
              {error ||
                "The purchase confirmation has expired. Please try again if you still wish to make the purchase."}
            </p>
            <Button onClick={handleGoHome} className="mt-4">
              Return to Home
            </Button>
          </div>
        );

      case "error":
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground mb-6">
              {error || "An error occurred while processing your purchase."}
            </p>
            <Button onClick={handleRetry} variant="outline" className="mt-2">
              Try Again
            </Button>
            <Button onClick={handleGoHome} className="mt-4">
              Return to Home
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Purchase Status</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
