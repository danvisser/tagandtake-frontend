"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@src/stores/authStore";
import LoginForm from "@src/components/LoginForm";

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      // Only redirect if login was successful
      if (result && result.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Error is already handled in the LoginForm component
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center w-full md:px-4">
      <div className="w-full max-w-md flex px-4 flex-col space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-center">
          Log in
        </h2>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
