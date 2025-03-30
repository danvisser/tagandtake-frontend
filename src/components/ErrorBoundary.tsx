"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="w-full max-w-md shadow-md">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="text-muted-foreground">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full mt-4"
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
