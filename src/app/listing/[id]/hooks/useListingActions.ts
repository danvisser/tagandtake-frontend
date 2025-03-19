"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  removeTagFromAbandonedListing,
  removeTagFromSoldListing,
  collectRecalledListing,
} from "@src/api/listingsApi";
import { Routes } from "@src/constants/routes";

export function useListingActions(listingId: number) {
  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isRemoveTagLoading, setIsRemoveTagLoading] = useState(false);
  const [isCollectLoading, setIsCollectLoading] = useState(false);

  // Handle checkout
  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      // Redirect to checkout page
      router.push(Routes.LISTING.CHECKOUT.ROOT(listingId.toString()));
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Handle remove tag from abandoned listing
  const handleRemoveTagFromAbandoned = async () => {
    setIsRemoveTagLoading(true);
    try {
      const response = await removeTagFromAbandonedListing(listingId);
      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
      } else {
        console.error("Failed to remove tag:", response.error);
      }
    } catch (err) {
      console.error("Remove tag error:", err);
    } finally {
      setIsRemoveTagLoading(false);
    }
  };

  // Handle remove tag from sold listing
  const handleRemoveTagFromSold = async () => {
    setIsRemoveTagLoading(true);
    try {
      const response = await removeTagFromSoldListing(listingId);
      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
      } else {
        console.error("Failed to remove tag:", response.error);
      }
    } catch (err) {
      console.error("Remove tag error:", err);
    } finally {
      setIsRemoveTagLoading(false);
    }
  };

  // Handle collect recalled listing
  const handleCollect = async (collectionPin: string) => {
    setIsCollectLoading(true);
    try {
      const response = await collectRecalledListing(listingId, collectionPin);
      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
      } else {
        console.error("Failed to collect item:", response.error);
      }
    } catch (err) {
      console.error("Collect error:", err);
    } finally {
      setIsCollectLoading(false);
    }
  };

  return {
    handleCheckout,
    handleRemoveTagFromAbandoned,
    handleRemoveTagFromSold,
    handleCollect,
    isCheckoutLoading,
    isRemoveTagLoading,
    isCollectLoading,
  };
}
