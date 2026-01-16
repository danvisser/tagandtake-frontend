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
  recallListing,
  delistListing,
  replaceListingTag,
} from "@src/api/listingsApi";
import { getRecallReasonById } from "@src/data/recallReasonsData";
import { RecallReasonType } from "@src/api/listingsApi";

// Define the error response type
interface ErrorResponse {
  detail?: string;
  [key: string]: string | undefined;
}

export function useListingActions(listingId: number): ListingActions {
  const router = useRouter();
  const [isRemoveTagLoading, setIsRemoveTagLoading] = useState(false);
  const [isCollectLoading, setIsCollectLoading] = useState(false);
  const [isRecallLoading, setIsRecallLoading] = useState(false);

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

  const handleRecall = async (reasonId: number): Promise<ActionResult> => {
    try {
      setIsRecallLoading(true);
      
      // Get the reason to determine its type
      const reason = getRecallReasonById(reasonId);
      if (!reason) {
        return {
          success: false,
          error: "Invalid recall reason",
        };
      }

      // Determine which endpoint to call based on reason type
      // Owner request and tag error both use delist endpoint
      const shouldDelist =
        reason.type === RecallReasonType.OWNER_REQUEST ||
        reason.type === RecallReasonType.TAG_ERROR;
      const response = shouldDelist
        ? await delistListing(listingId, reasonId)
        : await recallListing(listingId, reasonId);

      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
        return { success: true, error: null };
      } else {
        console.error("Failed to recall/delist listing:", response.error);
        
        // Try to extract error details
        let errorMessage = "Failed to process request";
        if (response.error) {
          if (typeof response.error === "string") {
            errorMessage = response.error;
          } else if (typeof response.error === "object" && response.error !== null) {
            const errorObj = response.error as ErrorResponse;
            errorMessage = errorObj.detail || JSON.stringify(response.error);
          }
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Error recalling/delisting listing:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process recall/delist request",
      };
    } finally {
      setIsRecallLoading(false);
    }
  };

  const handleReplaceTag = async (newTagId: number): Promise<ActionResult> => {
    try {
      setIsRecallLoading(true);
      const response = await replaceListingTag(listingId, newTagId);

      if (response.success) {
        // Refresh the page to show updated state
        router.refresh();
        return { success: true, error: null };
      } else {
        console.error("Failed to replace tag:", response.error);
        
        // Try to extract error details
        let errorMessage = "Failed to replace tag";
        if (response.error) {
          if (typeof response.error === "string") {
            errorMessage = response.error;
          } else if (typeof response.error === "object" && response.error !== null) {
            const errorObj = response.error as ErrorResponse;
            errorMessage = errorObj.detail || JSON.stringify(response.error);
          }
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Error replacing tag:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to replace tag",
      };
    } finally {
      setIsRecallLoading(false);
    }
  };

  return {
    handleRemoveTagFromAbandoned,
    handleRemoveTagFromSold,
    handleCollect,
    handleRecall,
    handleReplaceTag,
    isRemoveTagLoading,
    isCollectLoading,
    isRecallLoading,
  };
}
