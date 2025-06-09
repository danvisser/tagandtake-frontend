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
import { recallListing } from "@src/api/listingsApi";
import LoadingSpinner from "@src/components/LoadingSpinner";

export default function SimulateRecallPage() {
  const [listingId, setListingId] = useState("");
  const [reasonId, setReasonId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await recallListing(Number(listingId), Number(reasonId));
      if (response.success) {
        setStatus("success");
        setListingId("");
        setReasonId("");
      } else {
        setStatus("error");
        setErrorMessage(response.error || "Failed to recall listing");
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
            Recall Listing (Dev)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-primary" />
              <p className="text-center">Listing recalled successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="listingId"
                  type="number"
                  placeholder="Enter listing/tag ID"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <Input
                  id="reasonId"
                  type="number"
                  placeholder="Enter recall reason ID"
                  value={reasonId}
                  onChange={(e) => setReasonId(e.target.value)}
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
                  <LoadingSpinner size="sm" text="Recalling..." />
                ) : (
                  "Recall Listing"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
