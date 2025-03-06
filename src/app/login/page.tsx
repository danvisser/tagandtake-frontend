"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@src/stores/authStore";
import LoginForm from "@src/components/LoginForm";
import { Routes } from "@src/constants/routes";
import { UserRoles } from "@src/types/roles";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      const result = await login(email, password);
      if (result && result.success) {
        switch (result.role) {
          case UserRoles.STORE:
            router.push(Routes.STORE.DASHBOARD);
            break;
          case UserRoles.MEMBER:
            router.push(Routes.MEMBER.PROFILE);
            break;
          default:
            console.warn(`Unknown user role: ${result.role}`);
            router.push(Routes.MEMBER.PROFILE);
        }
      } else if (result && result.error) {
        setErrorMessage(String(result.error));
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

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
