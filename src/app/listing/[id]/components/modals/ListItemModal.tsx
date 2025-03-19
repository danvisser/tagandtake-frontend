"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Plus } from "lucide-react";
import { Routes } from "@src/constants/routes";
import { getAvailableItems, Item } from "@src/api/itemsApi";
import { createListing } from "@src/api/listingsApi";
import LoadingSpinner from "@src/components/LoadingSpinner";

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: number;
}

export default function ListItemModal({
  isOpen,
  onClose,
  tagId,
}: ListItemModalProps) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const response = await getAvailableItems();
        if (response.success) {
          setItems(response.data || []);
        } else {
          setError(response.error || "Failed to load items");
        }
      } catch {
        setError("An error occurred while fetching items");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [isOpen]);

  const handleCreateNewItem = () => {
    // Close the modal and navigate to create item page with tag context
    onClose();
    router.push(`${Routes.MEMBER.ITEMS.NEW}?tagId=${tagId}`);
  };

  const handleListItem = async () => {
    if (!selectedItem) {
      setError("Please select an item to list");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createListing({
        item_id: selectedItem,
        tag_id: tagId,
      });

      if (response.success) {
        onClose();
        router.refresh();
      } else {
        setError(
          typeof response.error === "string"
            ? response.error
            : "Failed to create listing"
        );
      }
    } catch {
      setError("An error occurred while creating the listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>List an Item</DialogTitle>
          <DialogDescription>
            Select an item to list or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>You don&apos;t have any available items to list.</p>
              <p className="mt-2">Create a new item to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedItem === item.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.category_details?.name} •{" "}
                    {item.condition_details?.condition}
                  </div>
                  <div className="text-sm font-medium mt-1">
                    £{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleCreateNewItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Item
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleListItem}
            disabled={!selectedItem || isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" text="Processing..." />
            ) : (
              "List Selected Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
