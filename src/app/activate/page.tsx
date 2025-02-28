"use client";

import { useState, useEffect } from "react";
import { Routes } from "@src/constants/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { activateAccount } from "@src/api/authApi";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

enum ActivationStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  INVALID = "invalid",
}

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ActivationStatus>(
    ActivationStatus.LOADING
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const uuid = searchParams.get("uuid");
    const token = searchParams.get("token");

    if (!uuid || !token) {
      setStatus(ActivationStatus.INVALID);
      return;
    }

    const activateUser = async () => {
      try {
        await activateAccount(uuid, token);
        setStatus(ActivationStatus.SUCCESS);
      } catch (error) {
        setStatus(ActivationStatus.ERROR);
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    };

    activateUser();
  }, [searchParams]);

  const handleGoToLogin = () => {
    router.push(Routes.LOGIN);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === ActivationStatus.SUCCESS && "Account Activated"}
            {status === ActivationStatus.ERROR && "Activation Failed"}
            {status === ActivationStatus.INVALID && "Invalid Activation Link"}
            {status === ActivationStatus.LOADING && "Activating Account..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === ActivationStatus.SUCCESS && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center">
                Your account has been successfully activated. You can now log
                in.
              </p>
            </>
          )}
          {status === ActivationStatus.ERROR && (
            <>
              <AlertCircle className="h-16 w-16 text-red-500" />
              <p className="text-center">
                We couldn&apos;t activate your account. {errorMessage}
              </p>
              <p className="text-center text-sm text-gray-500">
                The activation link may have expired or already been used.
              </p>
            </>
          )}
          {status === ActivationStatus.INVALID && (
            <>
              <AlertCircle className="h-16 w-16 text-amber-500" />
              <p className="text-center">
                The activation link is invalid. Please check your email for the
                correct link.
              </p>
            </>
          )}
          {status === ActivationStatus.LOADING && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status !== ActivationStatus.LOADING && (
            <Button onClick={handleGoToLogin}>Go to Login</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
