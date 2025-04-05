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
import LoadingSpinner from "@src/components/LoadingSpinner";
import { cn } from "@src/lib/utils";

interface RemoveTagConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  isLoading: boolean;
  variant?: "abandoned" | "sold";
}

export default function RemoveTagConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText = "Cancel",
  isLoading,
  variant = "abandoned",
}: RemoveTagConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-[90%] max-w-[425px] mx-auto p-4 sm:p-6",
          variant === "abandoned" ? "border-destructive" : "border-primary"
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-xl font-medium",
              variant === "abandoned" ? "text-destructive" : "text-primary"
            )}
          >
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            variant={variant === "abandoned" ? "destructive" : "default"}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Processing..." />
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
