"use client";

import { useState, useEffect } from "react";
import { Button } from "@src/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@src/api/paymentsApi";
import { Dialog, DialogContent, DialogTitle } from "@src/components/ui/dialog";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutButtonProps {
  tagId: number;
  buttonText?: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "secondary-inverse"
    | "ghost"
    | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonClassName?: string;
}

export default function StripeCheckoutButton({
  tagId,
  buttonText = "Buy Now",
  buttonVariant = "default",
  buttonSize = "default",
  buttonClassName = "",
}: StripeCheckoutButtonProps) {
  const searchParams = useSearchParams();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for payment success in URL
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      // Clean up the URL by removing the query parameter
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams]);

  const handleCheckoutClick = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createCheckoutSession(tagId);

      if (!response.success || !response.data?.client_secret) {
        throw new Error(response.error || "Failed to create checkout session");
      }

      setClientSecret(response.data.client_secret);
      setIsCheckoutOpen(true);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError("Failed to initialize checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setClientSecret(null);
    setError(null);
  };

  return (
    <>
      <Button
        onClick={handleCheckoutClick}
        variant={buttonVariant}
        size={buttonSize}
        className={buttonClassName}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </Button>

      <Dialog open={isCheckoutOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[95%] max-w-[800px] h-[90vh] max-h-[800px] mx-auto p-0 overflow-hidden flex flex-col">
          <DialogTitle className="sr-only">Checkout</DialogTitle>
          {error ? (
            <div className="p-6">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                onClick={handleCheckoutClick}
                className="w-full mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : clientSecret ? (
            <div className="flex-1 w-full overflow-hidden">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{
                  clientSecret,
                }}
              >
                <div className="h-full w-full overflow-auto">
                  <EmbeddedCheckout />
                </div>
              </EmbeddedCheckoutProvider>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground mt-2">
                Preparing your checkout...
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
