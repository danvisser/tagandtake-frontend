import React from "react";
import { ListingRole, ListingRoles } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
  VacantTag,
} from "@src/api/listingsApi";
import { formatDate } from "./listingHelpers";
import { ItemStatus } from "@src/api/itemsApi";
import { AlertCircle, CheckCircle, HelpCircle, XCircle } from "lucide-react";

// Define a consistent interface for all status messages
interface StatusMessageContent {
  icon: React.ReactNode;
  mainText: string;
  secondaryText?: string;
  additionalInfo?: string;
}

export function getStatusMessage(
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag,
  userRole: ListingRole | null
): StatusMessageContent | null {
  // Handle vacant tag
  if ("is_member" in listing) {
    return null; // Vacant tags don't have status messages
  }

  const item = listing.item_details;
  if (!item) return null;

  // Active listing
  if (item.status === ItemStatus.LISTED) {
    if (userRole === ListingRoles.VIEWER) {
      return {
        icon: null,
        mainText:
          "Please note: All sales are non-refundable.",
      };
    }
    return null;
  }

  // Recalled listing
  if (item.status === ItemStatus.RECALLED) {
    const recalledListing = listing as RecalledItemListing;

    if (userRole === ListingRoles.OWNER) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-destructive/50" />,
        mainText: `Collection pin: ${recalledListing.collection_pin}`,
        secondaryText: `Please take this tag to a member of staff to confirm collection`,
      };
    }


    if (userRole === ListingRoles.HOST) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-destructive/50" />,
        mainText: "Item recalled",
        secondaryText: `Must be collected by ${formatDate(recalledListing.collection_deadline)}`,
        additionalInfo: `Reason: ${recalledListing.reason.reason}`,
      };
    }

    // For viewers
    return {
      icon: <AlertCircle className="h-5 w-5 text-destructive/50" />,
      mainText: "This item is no longer available",
      secondaryText: "The store has removed this item from sale",
    };
  }

  // Abandoned listing
  if (item.status === ItemStatus.ABANDONED) {

    if (userRole === ListingRoles.HOST) {
      return {
        icon: <XCircle className="h-5 w-5 text-destructive/50" />,
        mainText: "Item abandoned",
        secondaryText: "Please remove this tag",
      };
    }

    // For viewers
    if (userRole === ListingRoles.OWNER) {
      return {
        icon: <HelpCircle className="h-5 w-5 text-destructive/50" />,
        mainText: "Please take this tag to a member of staff to remove the tag",
        secondaryText: "Your item may be reclaimed at the store's discretion",
      };
    }

    // For viewers 
    return {
      icon: <HelpCircle className="h-5 w-5 text-destructive/50" />,
      mainText: "Please take this tag to a member of staff",
      secondaryText: "This item is no longer available",
    };
  }

  // Sold listing
  if (item.status === ItemStatus.SOLD) {
    const soldListing = listing as SoldItemListing;

    if (userRole === ListingRoles.HOST) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-primary" />,
        mainText: "Item sold",
        secondaryText: "Please remove this tag",
        additionalInfo: `Sold on: ${formatDate(soldListing.sold_at)}`,
      };
    } else if (userRole === ListingRoles.OWNER) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-primary" />,
        mainText: "Your item has been sold",
        secondaryText: `Sold on: ${formatDate(soldListing.sold_at)}`,
      };
    }
    // For viewers
    return {
      icon: <HelpCircle className="h-5 w-5 text-destructive/50" />,
      mainText: "Please take item to a member of staff to remove the tag",
    };
  }

  return null;
}
