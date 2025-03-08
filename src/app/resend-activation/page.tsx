"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { resendActivation } from "@src/api/authApi";
import Link from "next/link";
import { Routes } from "@src/constants/routes";
import axios from "axios";

function ResendActivationContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get email from query params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      await resendActivation(trimmedEmail);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to resend activation:", err);

      // Log the full error response for debugging
      if (axios.isAxiosError(err)) {
        console.log("Error response data:", err.response?.data);

        // Try different possible error formats
        const errorMessage =
          err.response?.data?.error ||
          (typeof err.response?.data === "string" ? err.response.data : null);

        if (errorMessage) {
          if (typeof errorMessage === "string") {
            if (errorMessage.includes("already active")) {
              setError(
                "This account is already active. You can log in directly."
              );
            } else if (
              errorMessage.includes("No user") ||
              errorMessage.includes("not found")
            ) {
              setError("No account found with this email address.");
            } else {
              setError(errorMessage);
            }
          } else {
            // If it's an object or array, stringify it
            setError(JSON.stringify(errorMessage));
          }
        } else {
          setError(`Server error: ${err.response?.status || "unknown"}`);
        }
      } else {
        setError("Failed to send activation email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center w-full md:px-4">
      <div className="w-full max-w-md flex px-4 flex-col space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
          Resend Activation Email
        </h2>

        {success ? (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-black/10 text-primary px-4 py-3 rounded-md">
              <p className="text-sm font-medium">
                Activation email sent! Please check your inbox.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href={Routes.LOGIN}>
                <Button variant="secondary" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="Email address"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                )}
                Send Activation Email
              </Button>

              <div className="text-center">
                <Link
                  href={Routes.LOGIN}
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen justify-center items-center w-full md:px-4">
          <div className="w-full max-w-md flex px-4 flex-col space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
              Loading...
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      }
    >
      <ResendActivationContent />
    </Suspense>
  );
}
