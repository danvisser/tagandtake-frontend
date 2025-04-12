"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createItem } from "@src/api/itemsApi";
import { createListing } from "@src/api/listingsApi";
import { getBasicStoreInfo } from "@src/api/storeApi";
import { Button } from "@src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Store,
} from "lucide-react";
import ItemForm, {
  ItemFormData,
} from "@src/app/member/items/components/ItemForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";

export default function ListingsNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tag_id");
  const storeName = searchParams.get("store_name");
  const storeCommission = searchParams.get("commission");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdItemId, setCreatedItemId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [listingError, setListingError] = useState<string | null>(null);
  const [storeInfo, setStoreInfo] = useState<{
    store_name: string;
    commission: number;
    min_listing_days: number;
    min_price: number;
    categories: { id: number }[];
    conditions: { id: number }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);

  // Fetch store info if tagId is available
  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!tagId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getBasicStoreInfo(Number(tagId));
        if (response.success && response.data) {
          setStoreInfo({
            store_name: response.data.store_name,
            commission: response.data.commission,
            min_listing_days: response.data.min_listing_days,
            min_price: response.data.min_price,
            categories: response.data.categories || [],
            conditions: response.data.conditions || [],
          });
        } else {
          setStoreError(response.error || "Failed to fetch store information");
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
        setStoreError(
          "An unexpected error occurred while fetching store information"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreInfo();
  }, [tagId]);

  // Handle form submission
  const handleSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    setErrors({});
    setListingError(null);

    try {
      // Create the item
      const itemResponse = await createItem({
        name: data.name,
        description: data.description,
        size: data.size,
        price: data.price,
        condition: data.condition,
        category: data.category,
        image: data.image,
      });

      if (!itemResponse.success || !itemResponse.data) {
        // Convert ItemError to Record<string, string[]>
        const errorObj: Record<string, string[]> = {};
        if (itemResponse.error) {
          Object.entries(itemResponse.error).forEach(([key, value]) => {
            errorObj[key] = value;
          });
        }
        setErrors(errorObj);
        setIsSubmitting(false);
        return;
      }

      const createdItem = itemResponse.data;
      setCreatedItemId(createdItem.id);

      // Create the listing
      if (tagId) {
        const listingResponse = await createListing({
          item_id: createdItem.id,
          tag_id: Number(tagId),
        });

        if (!listingResponse.success) {
          setListingError(
            "Item was created but listing failed. You can find your item in your wardrobe."
          );
        }
      }

      // Show success message
      setSuccessMessage(
        tagId && !listingError
          ? "Item created and listed successfully!"
          : "Item created successfully!"
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating item:", error);
      setErrors({
        non_field_errors: ["An unexpected error occurred. Please try again."],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to item page
  const navigateToItem = () => {
    if (createdItemId) {
      router.push(`/items/${createdItemId}`);
    }
  };

  // Navigate to new item page
  const navigateToNewItem = () => {
    router.push("/items/new");
  };

  // Extract category and condition IDs from store info
  const availableCategoryIds =
    storeInfo?.categories?.map((cat) => cat.id) || [];
  const availableConditionIds =
    storeInfo?.conditions?.map((cond) => cond.id) || [];

  // If no tagId is provided, show a message
  if (!tagId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Invalid Listing Request
            </CardTitle>
            <CardDescription>
              No store tag ID was provided. Please scan a tag to create a
              listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                To create a listing, you need to scan a store tag first. This
                provides the necessary information about the store where your
                item will be listed.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Loading Store Information</CardTitle>
            <CardDescription>
              Please wait while we fetch the store details...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show error state
  if (storeError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Error Loading Store
            </CardTitle>
            <CardDescription>{storeError}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto mb-6 bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Listing in {storeInfo?.store_name || storeName || "Store"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Commission:</span>
              <span className="text-sm">
                {storeInfo?.commission || storeCommission || "0"}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Guaranteed Display Period:</span>
              <span className="text-sm">
                {storeInfo?.min_listing_days || "21"} days
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Min Price:</span>
              <span className="text-sm">£{storeInfo?.min_price || "0.00"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ItemForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={errors}
        submitButtonText="Create and List Item"
        availableCategories={availableCategoryIds}
        availableConditions={availableConditionIds}
      />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Success
            </DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>

          {listingError && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{listingError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={navigateToNewItem}
              className="w-full sm:w-auto"
            >
              Add Another Item
            </Button>
            <Button onClick={navigateToItem} className="w-full sm:w-auto">
              View Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
