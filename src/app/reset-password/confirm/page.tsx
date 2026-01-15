"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { AlertCircle, CheckCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import { confirmPasswordReset } from "@src/api/authApi";
import Link from "next/link";
import { Routes } from "@src/constants/routes";
import { AxiosError } from "axios";
import LoadingSpinner from "@src/components/LoadingSpinner";

enum ResetStatus {
  IDLE = "idle",
  SUCCESS = "success",
  ERROR = "error",
  INVALID = "invalid",
}

function ConfirmResetPasswordContent() {
  const searchParams = useSearchParams();

  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ResetStatus>(ResetStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState("");

  // Extract token and uid from URL
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uid || !token) {
      setStatus(ResetStatus.INVALID);
    }
  }, [uid, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswords = () => {
    if (passwords.new_password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return false;
    }

    if (passwords.new_password !== passwords.confirm_new_password) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      setStatus(ResetStatus.ERROR);
      return;
    }

    if (!uid || !token) {
      setStatus(ResetStatus.INVALID);
      return;
    }

    setIsSubmitting(true);
    setStatus(ResetStatus.IDLE);
    setErrorMessage("");

    try {
      await confirmPasswordReset({
        uid,
        token,
        new_password: passwords.new_password,
        confirm_new_password: passwords.confirm_new_password,
      });
      setStatus(ResetStatus.SUCCESS);
    } catch (error) {
      setStatus(ResetStatus.ERROR);

      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as AxiosError<{
            new_password?: string[];
            non_field_errors?: string[];
            [key: string]: string[] | undefined;
          }>
        ).response?.data;

        if (response) {
          if (response.new_password) {
            setErrorMessage(response.new_password.join(", "));
          } else if (response.non_field_errors) {
            setErrorMessage(response.non_field_errors.join(", "));
          } else {
            setErrorMessage(
              "Failed to reset password. The link may have expired."
            );
          }
        }
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to reset password. The link may have expired."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  if (status === ResetStatus.INVALID) {
    return (
      <div className="flex min-h-full justify-center items-center w-full md:px-4">
        <div className="w-full max-w-md px-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-16 w-16 text-amber-500" />
              <p className="text-center">
                The password reset link is invalid or has expired.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href={Routes.PASSWORD.RESET}>
                <Button>Request New Reset Link</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full justify-center items-center w-full md:px-4">
      <div className="w-full max-w-md px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
              Set New Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === ResetStatus.SUCCESS ? (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-primary" />
                <p className="text-center">
                  Your password has been successfully reset.
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  You can now log in with your new password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password"></Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      name="new_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwords.new_password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <Label htmlFor="confirm_new_password"></Label>
                  <Input
                    id="confirm_new_password"
                    name="confirm_new_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirm_new_password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="h-2"></div>

                {status === ResetStatus.ERROR && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" text="Resetting..." />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === ResetStatus.SUCCESS ? (
              <Link href={Routes.LOGIN}>
                <Button>Go to Login</Button>
              </Link>
            ) : (
              <div className="text-sm text-center">
                <Link
                  href={Routes.LOGIN}
                  className="text-primary hover:underline"
                >
                  Back to login
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full justify-center items-center w-full md:px-4">
          <div className="w-full max-w-md px-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
                  Loading...
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <LoadingSpinner size="md" />
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <ConfirmResetPasswordContent />
    </Suspense>
  );
}
