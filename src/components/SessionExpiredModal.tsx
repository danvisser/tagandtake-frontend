"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Routes } from "@src/constants/routes";
import { LogIn, Home } from "lucide-react";

export function SessionExpiredModal() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowModal(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLogin = () => {
    setShowModal(false);
    router.push(Routes.LOGIN);
  };

  const handleHome = () => {
    setShowModal(false);
    router.push(Routes.HOME);
  };

  // This ensures the modal can't be closed by clicking outside or pressing escape
  const handleOpenChange = (open: boolean) => {
    // Ignore attempts to close the modal
    if (open === false) return;
    setShowModal(open);
  };

  return (
    <Dialog open={showModal} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-[90%] max-w-md mx-auto p-4 sm:p-6"
        hideCloseButton={true}
      >
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-xl">Session expired</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center sm:text-left">
          <p>Please sign in again to continue.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:justify-end">
          <Button onClick={handleLogin} className="w-full sm:w-auto">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </Button>
          <Button
            variant="outline"
            onClick={handleHome}
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
