"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@src/lib/utils";

interface LoadingSpinnerProps {
  /** Size of the spinner (small, medium, large) */
  size?: "sm" | "md" | "lg";
  /** Optional text to display next to the spinner */
  text?: string;
  /** Optional className for additional styling */
  className?: string;
  /** Optional className for the spinner itself */
  spinnerClassName?: string;
  /** Optional className for the text */
  textClassName?: string;
}

export default function LoadingSpinner({
  size = "md",
  text,
  className,
  spinnerClassName,
  textClassName,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Loader2 
        className={cn(
          "animate-spin", 
          sizeClasses[size], 
          text ? "mr-2" : "",
          spinnerClassName
        )} 
      />
      {text && <span className={cn("text-sm", textClassName)}>{text}</span>}
    </div>
  );
} 