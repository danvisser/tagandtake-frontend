"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import LoadingSpinner from "@src/components/LoadingSpinner";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollect: (pin: string) => void;
  isLoading: boolean;
}

export default function CollectionModal({
  isOpen,
  onClose,
  onCollect,
  isLoading,
}: CollectionModalProps) {
  const [collectionPin, setCollectionPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!collectionPin.trim()) {
      setError("Please enter a collection PIN");
      return;
    }

    onCollect(collectionPin);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Collect Item</DialogTitle>
          <DialogDescription>
            Enter the collection PIN provided by the item owner to complete the
            collection process.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="collection-pin">Collection PIN</Label>
              <Input
                id="collection-pin"
                value={collectionPin}
                onChange={(e) => {
                  setCollectionPin(e.target.value);
                  setError("");
                }}
                placeholder="Enter PIN"
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <DialogFooter>
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
