"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@src/stores/authStore";
import LoginForm from "@src/components/LoginForm";
import LoadingUI from "@src/components/LoadingUI";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      setIsLoading(true);
      const result = await login(email, password);

      if (result.success) {
        // Check for return path from session expiration
        const returnPath = sessionStorage.getItem("returnPath");
        if (returnPath) {
          sessionStorage.removeItem("returnPath");
          router.push(returnPath);
          router.refresh();
        }
      } else if (result.error) {
        setErrorMessage(String(result.error));
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
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
        <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />
      </div>
    </div>
  );
}
