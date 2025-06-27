"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Routes } from "@src/constants/routes";
import { getAvailableItems, Item } from "@src/api/itemsApi";
import { createListing } from "@src/api/listingsApi";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { formatCurrency } from "@src/lib/formatters";
import { Card } from "@src/components/ui/card";
import { useToast } from "@src/hooks/use-toast";
import { handleListingError } from "@src/app/listing/[id]/utils/listingErrorHandler";
import { useListingContext } from "@src/app/listing/[id]/context/ListingContext";
import TermsAndConditionsModal from "@src/app/listing/[id]/components/modals/TermsAndConditionsModal";
import { Checkbox } from "@src/components/ui/checkbox";
import { Label } from "@src/components/ui/label";

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: number;
  storeCommission: number;
}

export default function ListItemModal({
  isOpen,
  onClose,
  tagId,
  storeCommission,
}: ListItemModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { setIsListingSuccessModalOpen } = useListingContext();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

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
    onClose();
    router.push(`${Routes.LISTING.NEW}?tag_id=${tagId}`);
  };

  const handleEditItem = (itemId: number) => {
    router.push(Routes.MEMBER.ITEMS.EDIT(itemId.toString()));
  };

  const handleListItem = async (itemId: number) => {
    if (!acceptedTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description:
          "You must accept the terms and conditions to list an item.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createListing({
        item_id: itemId,
        tag_id: tagId,
      });

      if (response.success) {
        onClose();
        setIsListingSuccessModalOpen(true);
        router.refresh();
      } else {
        handleListingError(response.error || null);
      }
    } catch (err) {
      console.error("Listing Error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while creating the listing.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate price after store commission
  const calculatePriceAfterCommission = (price: number) => {
    return price * (1 - storeCommission / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader className="px-4 py-6 space-y-1.5">
          <DialogTitle className="text-2xl font-medium m-2">
            List a new item
          </DialogTitle>
          <Button
            onClick={handleCreateNewItem}
            className="w-full h-12 mt-2 text-base"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Item
          </Button>
        </DialogHeader>

        <div className="relative -mt-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xl font-medium text-gray-600">
              or
            </span>
          </div>
        </div>

        <div className="p-4 pt-2">
          <h3 className="text-2xl font-medium mb-3">From your wardrobe</h3>

          {/* Terms and Conditions Checkbox above the list, only if there are items */}
          {items.length > 0 && (
            <div className="mb-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms-checkbox"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) =>
                    setAcceptedTerms(checked as boolean)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms-checkbox"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-primary hover:underline"
                    >
                      terms and conditions
                    </button>
                  </Label>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You don&apos;t have any available items to list.</p>
                <p className="mt-2">Create a new item to get started.</p>
              </div>
            ) : (
              items.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-gray-200 active:bg-slate-300 transition-colors"
                  variant="default"
                >
                  <div className="flex items-start p-3 gap-3">
                    <div className="relative aspect-square w-28 flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0].image_url}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 112px) 100vw, 112px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-md">
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-base leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-muted-foreground hover:text-primary flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditItem(item.id);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="text-xs">Edit</span>
                        </Button>
                      </div>
                      <div className="mt-1.5">
                        <div className="text-base font-semibold">
                          {formatCurrency(item.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          You&apos;ll receive{" "}
                          {formatCurrency(
                            calculatePriceAfterCommission(item.price)
                          )}
                        </div>
                      </div>
                      <Button
                        className="w-full mt-1 h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleListItem(item.id);
                        }}
                        disabled={isSubmitting || !acceptedTerms}
                      >
                        {isSubmitting ? (
                          <LoadingSpinner size="sm" text="Processing..." />
                        ) : (
                          "List Item"
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>

      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </Dialog>
  );
}
