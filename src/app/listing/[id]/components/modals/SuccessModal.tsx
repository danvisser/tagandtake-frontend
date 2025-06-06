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
import { CheckCircle, Tag, AlertCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  shouldRefresh?: boolean;
  secondaryMessage?: string;
  secondaryIcon?: "tag" | "alert" | "none";
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Close",
  shouldRefresh = false,
  secondaryMessage,
  secondaryIcon = "none",
}: SuccessModalProps) {
  const handleClose = () => {
    onClose();
    if (shouldRefresh) {
      window.location.reload();
    }
  };

  // Render the appropriate icon based on the secondaryIcon prop
  const renderSecondaryIcon = () => {
    if (secondaryIcon === "tag") {
      return <Tag className="h-6 w-6 text-primary" />;
    } else if (secondaryIcon === "alert") {
      return <AlertCircle className="h-6 w-6 text-amber-500" />;
    }
    return null;
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

        {secondaryMessage && (
          <div className="mt-4 p-3 bg-slate-200 rounded-md flex items-start gap-2">
            {renderSecondaryIcon()}
            <p className="text-lg font-medium text-primary mb-3 mt-3">
              {secondaryMessage}
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-center mt-4">
          <Button onClick={handleClose} className="w-full sm:w-auto">
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
