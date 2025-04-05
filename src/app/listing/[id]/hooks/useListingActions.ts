"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ListingActions,
  ActionResult,
} from "@src/app/listing/[id]/context/ListingContext";
import {
  collectRecalledListing,
  removeTagFromAbandonedListing,
  removeTagFromSoldListing,
} from "@src/api/listingsApi";

// Define the error response type
interface ErrorResponse {
  detail?: string;
  [key: string]: string | undefined;
}

export function useListingActions(listingId: number): ListingActions {
  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isRemoveTagLoading, setIsRemoveTagLoading] = useState(false);
  const [isCollectLoading, setIsCollectLoading] = useState(false);

  const handleCheckout = async (): Promise<ActionResult> => {
    try {
      setIsCheckoutLoading(true);
      // TODO: Implement checkout logic
      return { success: true, error: null };
    } catch (error) {
      console.error("Error during checkout:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process checkout",
      };
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleRemoveTagFromAbandoned = async (): Promise<ActionResult> => {
    try {
      setIsRemoveTagLoading(true);
      const response = await removeTagFromAbandonedListing(listingId);

      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
        return { success: true, error: null };
      } else {
        console.error("Failed to remove tag:", response.error);
        return {
          success: false,
          error:
            response.error || "Failed to remove tag from abandoned listing",
        };
      }
    } catch (error) {
      console.error("Error removing tag from abandoned listing:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove tag from abandoned listing",
      };
    } finally {
      setIsRemoveTagLoading(false);
    }
  };

  const handleRemoveTagFromSold = async (): Promise<ActionResult> => {
    try {
      setIsRemoveTagLoading(true);
      const response = await removeTagFromSoldListing(listingId);

      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
        return { success: true, error: null };
      } else {
        console.error("Failed to remove tag:", response.error);
        return {
          success: false,
          error: response.error || "Failed to remove tag from sold listing",
        };
      }
    } catch (error) {
      console.error("Error removing tag from sold listing:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove tag from sold listing",
      };
    } finally {
      setIsRemoveTagLoading(false);
    }
  };

  const handleCollect = async (pin: string): Promise<ActionResult> => {
    try {
      setIsCollectLoading(true);
      const response = await collectRecalledListing(listingId, pin);

      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
        return { success: true, error: null };
      } else {
        console.error("Failed to collect item:", response.error);

        // Handle specific error cases
        if (
          response.error === "Invalid PIN." ||
          (typeof response.error === "object" &&
            (response.error as ErrorResponse).detail === "Invalid PIN.")
        ) {
          return {
            success: false,
            error: "Invalid collection PIN. Please try again.",
          };
        }

        return {
          success: false,
          error: response.error || "Failed to collect item",
        };
      }
    } catch (error) {
      console.error("Error collecting item:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to collect item",
      };
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
