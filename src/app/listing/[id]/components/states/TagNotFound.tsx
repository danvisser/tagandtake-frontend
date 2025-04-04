"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Home } from "lucide-react";
import { Routes } from "@src/constants/routes";

export default function TagNotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="pt-6 pb-6 px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-xl font-semibold">Tag Not Found</h2>
            <p className="text-muted-foreground">
              The tag you&apos;re looking for does not exist.
            </p>

            <Button
              className="w-full mt-4"
              onClick={() => router.push(Routes.HOME)}
            >
              <Home className="w-4 h-4 mr-2" /> Take me home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
