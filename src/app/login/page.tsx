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
    <div className="container flex min-h-screen w-full flex-col justify-center px-4 md:px-6"> 
      <div className="mx-auto w-full max-w-[400px] space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Log in
          </h2>
        </div>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
