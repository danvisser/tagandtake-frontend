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

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  isLoading: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText = "Cancel",
  isLoading,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
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
