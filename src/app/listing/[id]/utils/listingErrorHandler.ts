import { ListingError } from "@src/api/listingsApi";
import { toast } from "@src/hooks/use-toast";

/**
 * Handles listing errors and displays appropriate toast notifications
 * @param error The error object from the API response
 */
export function handleListingError(error: ListingError | string | null) {
  // Log the error for debugging
  console.log("Listing Error Response:", {
    error,
    errorType: typeof error,
    errorKeys: error && typeof error === "object" ? Object.keys(error) : [],
  });

  if (!error) {
    console.error("No error object found in response");
    toast({
      variant: "destructive",
      title: "Error",
      description: "An unexpected error occurred",
    });
    return;
  }

  // If error is a string, display it directly
  if (typeof error === "string") {
    toast({
      variant: "destructive",
      title: "Error",
      description: error,
    });
    return;
  }

  // Handle validation errors in order of user actionability
  if (error.item_id?.[0] || error.item?.[0]) {
    toast({
      variant: "destructive",
      title: "Item Error",
      description: error.item_id?.[0] || error.item?.[0],
    });
  } else if (error.tag_id?.[0] || error.tag?.[0]) {
    toast({
      variant: "destructive",
      title: "Tag Error",
      description: error.tag_id?.[0] || error.tag?.[0],
    });
  } else if (error.condition?.[0]) {
    toast({
      variant: "destructive",
      title: "Condition Error",
      description: error.condition[0],
    });
  } else if (error.category?.[0]) {
    toast({
      variant: "destructive",
      title: "Category Error",
      description: error.category[0],
    });
  } else if (error.price?.[0]) {
    toast({
      variant: "destructive",
      title: "Price Error",
      description: error.price[0],
    });
  } else if (error.store?.[0]) {
    toast({
      variant: "destructive",
      title: "Store Error",
      description: error.store[0],
    });
  } else if (error.listing_limit?.[0]) {
    toast({
      variant: "destructive",
      title: "Listing Limit Error",
      description: error.listing_limit[0],
    });
  } else if (error.non_field_errors?.[0]) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.non_field_errors[0],
    });
  } else {
    // If no specific error field matches, show a generic error
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create listing",
    });
  }
}
