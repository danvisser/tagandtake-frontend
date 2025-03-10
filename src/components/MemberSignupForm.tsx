"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Routes } from "@src/constants/routes";
import { MemberSignupCredentials, MemberSignupError } from "@src/api/singupApi";

interface MemberSignupFormProps {
  onSubmit: (credentials: MemberSignupCredentials) => Promise<void>;
  errors?: MemberSignupError | null;
}

export default function MemberSignupForm({
  onSubmit,
  errors,
}: MemberSignupFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        username,
        email,
        password,
        password2,
      });
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderFieldError = (fieldErrors?: string[]) => {
    if (!fieldErrors || fieldErrors.length === 0) return null;

    return (
      <div className="text-destructive text-sm mt-1">
        {fieldErrors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      {errors?.non_field_errors && (
        <div className="text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20 bg-destructive/10">
          {errors.non_field_errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {renderFieldError(errors?.username)}
          </div>

          <div className="space-y-1">
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {renderFieldError(errors?.email)}
          </div>

          <div className="space-y-1 relative">
            <Input
              id="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-muted-foreground" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {renderFieldError(errors?.password)}
          </div>

          <div className="space-y-1 relative">
            <Input
              id="password2"
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              disabled={isLoading}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <Eye className="w-4 h-4 text-muted-foreground" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {renderFieldError(errors?.password2)}
          </div>

          <Button disabled={isLoading} type="submit" className="w-full mt-6">
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            )}
            Create Account
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      <div className="w-full">
        <Link href={Routes.LOGIN} className="w-full">
          <Button
            variant="secondary"
            type="button"
            disabled={isLoading}
            className="w-full"
          >
            Sign in
          </Button>
        </Link>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Interested in hosting?&nbsp;
        <Link
          href={Routes.SIGNUP.STORE}
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Become a host today
        </Link>
      </p>
    </div>
  );
}
