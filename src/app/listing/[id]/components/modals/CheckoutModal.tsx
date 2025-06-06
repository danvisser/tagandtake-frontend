"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@src/api/paymentsApi";
import { useParams, useSearchParams } from "next/navigation";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  price: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  itemName,
  price,
}: CheckoutModalProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Define handleInitCheckout before it's used in useEffect
  const handleInitCheckout = useCallback(async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      const response = await createCheckoutSession(Number(params.id));
      if (!response.success || !response.data?.client_secret) {
        throw new Error(response.error || "Failed to create checkout session");
      }
      setClientSecret(response.data.client_secret);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setLocalError(
        error instanceof Error ? error.message : "Failed to initialize checkout"
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  // Check for payment success in URL
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      // Close the checkout modal
      onClose();
    }
  }, [searchParams, onClose]);

  useEffect(() => {
    if (isOpen && !clientSecret) {
      handleInitCheckout();
    }
  }, [isOpen, clientSecret, handleInitCheckout]);

  const handleClose = () => {
    setClientSecret(null);
    setLocalError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95%] max-w-[800px] h-[90vh] max-h-[800px] mx-auto p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-medium">
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription className="text-sm mt-2">
            {itemName} - {price}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Preparing your checkout...
            </p>
          </div>
        ) : localError ? (
          <div className="p-6">
            <p className="text-sm text-destructive">{localError}</p>
            <Button
              onClick={handleInitCheckout}
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
