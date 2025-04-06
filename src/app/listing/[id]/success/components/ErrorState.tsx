import { Button } from "@src/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
  onGoHome: () => void;
}

export function ErrorState({ onRetry, onGoHome }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
      </div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-center">
        Something went wrong
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center">
        We couldn&apos;t verify your purchase - please try refreshing the page.
        <br />
        If the problem persists, contact a member of staff.
      </p>

      <div className="flex flex-col gap-2 sm:gap-3 w-full">
        <Button onClick={onRetry} className="h-11 sm:h-12 w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
        <Button
          variant="outline"
          onClick={onGoHome}
          className="h-11 sm:h-12 w-full"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
