"use client";

import { useState } from "react";
import StoreSignupForm from "@src/app/signup/store/components/StoreSignupForm";
import {
  signupStore,
  StoreSignupCredentials,
  StoreSignupError,
} from "@src/api/signupApi";
import { CheckCircle, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import { Routes } from "@src/constants/routes";
import { Button } from "@src/components/ui/button";
import { useRouter } from "next/navigation";

export default function StoreSignupPage() {
  const [errors, setErrors] = useState<StoreSignupError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const handleStoreSignup = async (credentials: StoreSignupCredentials) => {
    try {
      setErrors(null);
      const result = await signupStore(credentials);

      if (result.success && result.data) {
        setIsSuccess(true);
        setUserEmail(result.data.email);
      } else if (result.error) {
        setErrors(result.error);
      }
    } catch (error) {
      console.error("Store signup failed:", error);
      setErrors({
        non_field_errors: [
          "An unexpected error occurred. Please try again later.",
        ],
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen justify-center items-center w-full md:px-4">
        <div className="w-full max-w-md flex px-4 flex-col space-y-6">
          <Alert className="border-green-200 bg-green-50 p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <AlertTitle className="text-green-800 font-medium text-lg">
                  Store account created successfully!
                </AlertTitle>
              </div>

              <AlertDescription className="text-green-700 mt-2">
                <p>We&apos;ve sent an activation link to:</p>
                <p className="font-medium text-center my-3 text-green-800 break-all">
                  {userEmail}
                </p>
                <p>Please check your email and activate your account.</p>

                <div className="pt-2 border-t border-green-200">
                  <Button
                    onClick={() => router.push(Routes.LOGIN)}
                    className="w-full mt-4"
                    variant="default"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Return to login
                  </Button>
                </div>
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Fixed header section */}
      <div className="w-full py-12 bg-background">
        <div className="container max-w-md mx-auto px-4">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
            Sign up and{" "}
            <span className="border-b-4 border-primary/50">become a host!</span>
          </h2>
          <p className="text-center text-muted-foreground mt-2">
            Join the forward-thinking businesses transforming unused space into
            hubs for revenue and community.
          </p>
        </div>
      </div>

      {/* Scrollable form section */}
      <div className="flex-1 w-full">
        <div className="container max-w-md mx-auto px-4 py-4">
          <StoreSignupForm onSubmit={handleStoreSignup} errors={errors} />
        </div>
      </div>
    </div>
  );
}
