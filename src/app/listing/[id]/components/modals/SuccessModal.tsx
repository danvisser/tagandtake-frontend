"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  shouldRefresh?: boolean;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Close",
  shouldRefresh = false,
}: SuccessModalProps) {
  const handleClose = () => {
    onClose();
    if (shouldRefresh) {
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-[425px] mx-auto p-4 sm:p-6">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle className="text-xl font-medium">{title}</DialogTitle>
          <DialogDescription className="text-sm mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center mt-4">
          <Button onClick={handleClose} className="w-full sm:w-auto">
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
