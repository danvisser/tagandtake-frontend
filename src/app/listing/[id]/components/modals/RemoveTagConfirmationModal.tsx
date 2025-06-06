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

interface RemoveTagConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmButtonText: string;
  isLoading: boolean;
  variant: "abandoned" | "sold";
  error?: string | null;
}

export default function RemoveTagConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  isLoading,
  variant,
  error,
}: RemoveTagConfirmationModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error(`Error removing tag from ${variant} listing:`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">{title}</DialogTitle>
          <DialogDescription className="text-sm mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="py-2">
            <p className="text-sm text-destructive/50">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
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
