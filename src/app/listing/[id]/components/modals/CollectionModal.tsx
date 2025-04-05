"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import LoadingSpinner from "@src/components/LoadingSpinner";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollect: (pin: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function CollectionModal({
  isOpen,
  onClose,
  onCollect,
  isLoading,
  error,
}: CollectionModalProps) {
  const [collectionPin, setCollectionPin] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!collectionPin.trim()) {
      setLocalError("Please enter a collection PIN");
      return;
    }

    onCollect(collectionPin);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Collect Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="collection-pin"
                value={collectionPin}
                onChange={(e) => {
                  setCollectionPin(e.target.value);
                  setLocalError("");
                }}
                placeholder="Enter PIN"
                className={localError || error ? "border-destructive/50" : ""}
              />
              {localError && (
                <p className="text-sm text-destructive">{localError}</p>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner size="sm" text="Processing..." />
              ) : (
                "Collect Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
