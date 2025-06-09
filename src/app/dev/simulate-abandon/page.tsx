"use client";

import { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { simulateAbandonListing } from "@src/api/devApi";
import LoadingSpinner from "@src/components/LoadingSpinner";

export default function SimulateAbandonPage() {
  const [listingId, setListingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await simulateAbandonListing(Number(listingId));
      if (response.success) {
        setStatus("success");
        setListingId("");
      } else {
        setStatus("error");
        setErrorMessage(response.error || "Failed to simulate abandon");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center w-full md:px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
            Simulate Abandon (Dev)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-primary" />
              <p className="text-center">Abandon simulated successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="listingId"
                  type="number"
                  placeholder="Enter recalled listing/tag ID"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoadingSpinner size="sm" text="Simulating..." />
                ) : (
                  "Simulate Abandon"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
