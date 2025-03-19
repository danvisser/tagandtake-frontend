"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { createCheckoutSession } from "@src/api/paymentsApi";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "@src/components/LoadingSpinner";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  listingId,
}: CheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const initiateCheckout = async () => {
      setIsLoading(true);
      setError("");

      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Failed to load Stripe");
        }

        const response = await createCheckoutSession(listingId);
        if (!response.success) {
          throw new Error(
            response.error || "Failed to create checkout session"
          );
        }

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data?.id || "",
        });

        if (error) {
          throw new Error(error.message || "Failed to redirect to checkout");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    initiateCheckout();
  }, [isOpen, listingId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            You&apos;re being redirected to our secure payment processor.
          </DialogDescription>
        </DialogHeader>

        <div className="py-8 flex flex-col items-center justify-center">
          {isLoading ? (
            <>
              <LoadingSpinner size="md" text="Preparing your checkout..." />
            </>
          ) : error ? (
            <>
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={onClose}>Close</Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
