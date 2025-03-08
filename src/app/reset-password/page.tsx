"use client";

import { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { requestPasswordReset } from "@src/api/authApi";
import Link from "next/link";
import { Routes } from "@src/constants/routes";
import { AxiosError } from "axios";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await requestPasswordReset(email);
      setStatus("success");
    } catch (error) {
      setStatus("error");

      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as AxiosError<{
            email?: string[];
            [key: string]: string[] | undefined;
          }>
        ).response?.data;

        if (response) {
          if (response.email) {
            setErrorMessage(response.email.join(", "));
          } else {
            setErrorMessage("Failed to send reset link. Please try again.");
          }
        } else {
          setErrorMessage("Failed to send reset link. Please try again.");
        }
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to send reset link. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center w-full md:px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-primary" />
              <p className="text-center">
                We&apos;ve sent an email to{" "}
                <span className="font-medium">{email}</span> with a password
                reset link.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Please check your inbox and spam folder. The link will expire in
                24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email"></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            <Link href={Routes.LOGIN} className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
