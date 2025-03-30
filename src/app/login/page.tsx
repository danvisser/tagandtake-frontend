"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@src/providers/AuthProvider";
import LoginForm from "@src/components/LoginForm";
import LoadingUI from "@src/components/LoadingUI";
import { Routes } from "@src/constants/routes";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      const result = await login(email, password);

      if (result.success) {
        const returnPath = sessionStorage.getItem("returnPath");
        if (returnPath) {
          sessionStorage.removeItem("returnPath");
          router.push(returnPath);
        } else {
          router.push(Routes.HOME);
        }
      } else {
        setErrorMessage(result.error || "Login failed");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  if (isLoading) {
    return <LoadingUI />;
  }

  return (
    <div className="flex min-h-screen justify-center items-center w-full md:px-4">
      <div className="w-full max-w-md flex px-4 flex-col space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
          Log in
        </h2>
        <LoginForm
          onSubmit={handleLogin}
          errorMessage={errorMessage || error?.message}
        />
      </div>
    </div>
  );
}
