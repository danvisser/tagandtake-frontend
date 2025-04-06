import { Button } from "@src/components/ui/button";
import { Home, Clock, RefreshCw } from "lucide-react";

interface ExpiredStateProps {
  onGoHome: () => void;
  onRetry: () => void;
}

export function ExpiredState({ onGoHome, onRetry }: ExpiredStateProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
        <Clock className="h-8 w-8 text-amber-500" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Session Expired
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Your purchase session has expired. Please try again or contact support
        if you need assistance.
      </p>

      <div className="flex flex-col gap-3 w-full">
      <Button onClick={onRetry} className="h-12 w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
        <Button variant="outline" onClick={onGoHome} className="h-12 w-full">
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
