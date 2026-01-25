"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import LoadingSpinner from "@src/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { generateNewStorePin } from "@src/api/storeApi";

interface PinEntryPageProps {
  onValidate: (pin: string) => Promise<boolean>;
}

export default function PinEntryPage({ onValidate }: PinEntryPageProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestPinDialogOpen, setRequestPinDialogOpen] = useState(false);
  const [requestPinIsSubmitting, setRequestPinIsSubmitting] = useState(false);
  const [requestPinSent, setRequestPinSent] = useState(false);
  const [requestPinError, setRequestPinError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await onValidate(pin);
      if (!isValid) {
        setError("Invalid PIN");
        setPin("");
      }
    } catch {
      setError("Failed to validate PIN");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  const openRequestPinDialog = () => {
    setRequestPinSent(false);
    setRequestPinError(null);
    setRequestPinDialogOpen(true);
  };

  const submitRequestNewPin = async () => {
    try {
      setRequestPinIsSubmitting(true);
      setRequestPinError(null);
      const res = await generateNewStorePin();
      if (res.success) {
        setRequestPinSent(true);
        return;
      }
      setRequestPinError(res.error ?? "Please try again.");
    } finally {
      setRequestPinIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-normal leading-8 mb-12">Payment Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Enter Store PIN</CardTitle>
            <CardDescription>
              Your store PIN is required to access payment settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Store PIN</Label>
                <Input
                  id="pin"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setPin(value);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className={error ? "border-destructive" : ""}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Forgot PIN?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 align-baseline"
                    onClick={openRequestPinDialog}
                    disabled={isLoading}
                  >
                    Request a new PIN
                  </Button>
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || pin.length !== 4}>
                  {isLoading ? (
                    <LoadingSpinner size="sm" text="Validating..." />
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={requestPinDialogOpen}
        onOpenChange={(open) => {
          setRequestPinDialogOpen(open);
          if (!open) {
            setRequestPinSent(false);
            setRequestPinError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request a new PIN</DialogTitle>
          </DialogHeader>

          {!requestPinSent ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We&apos;ll generate a new store PIN and email it to you. Your existing PIN will no
                longer work.
              </p>
              {requestPinError && (
                <p className="text-sm text-destructive">{requestPinError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                New PIN sent. Please check your email.
              </p>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            {!requestPinSent ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRequestPinDialogOpen(false);
                  }}
                  disabled={requestPinIsSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={submitRequestNewPin}
                  disabled={requestPinIsSubmitting}
                >
                  Request new PIN
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setRequestPinDialogOpen(false);
                }}
              >
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
