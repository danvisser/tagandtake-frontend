"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@src/components/ui/button"
import { Label } from "@src/components/ui/label"
import { Input } from "@src/components/ui/input"
import { Checkbox } from "@src/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      await onSubmit(email, password)
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              id="email"
              placeholder="Email or username"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-6"
            />
          </div>
          <div className="space-y-2 relative">
            <Input
              id="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-6"
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/3 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
            aria-label={showPassword ? "Hide password" : "Show password"}
            >
            {showPassword ?   <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
            </button>

          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label 
                htmlFor="remember" 
                className="text-sm font-normal text-muted-foreground"
              >
                Remember me
              </Label>
            </div>
            <Link 
              href="/forgot-password" 
              className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button 
            disabled={isLoading} 
            type="submit"
            className="w-full"
          >
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Don&apos;t have an account?
          </span>
        </div>
      </div>
      <div className="w-full">
        <Link href="/register/member" className="w-full">
          <Button variant="secondary" type="button" disabled={isLoading} className="w-full">
            Sign up
          </Button>
        </Link>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Interested in hosting?&nbsp;
        <Link
            href="/register/host"
            className="font-medium underline underline-offset-4 hover:text-primary"
        >
        Become a host today
        </Link>
      </p>
    </div>
  )
}
