import React from "react";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
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
    return null; // Active listings don't have status messages
  }

  // Recalled listing
  if (item.status === ItemStatus.RECALLED) {
    const recalledListing = listing as RecalledItemListing;

    if (userRole === LISTING_ROLES.OWNER) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        mainText: "Your item has been recalled",
        secondaryText: `Please collect by ${formatDate(recalledListing.collection_deadline)}`,
        additionalInfo: `Reason: ${recalledListing.reason.reason}`,
      };
    }

    if (userRole === LISTING_ROLES.HOST) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        mainText: "Item recalled",
        secondaryText: `Must be collected by ${formatDate(recalledListing.collection_deadline)}`,
        additionalInfo: `Reason: ${recalledListing.reason.reason}`,
      };
    }

    // For viewers
    return {
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      mainText: "This item has been recalled",
      secondaryText: "This item is no longer available for purchase",
    };
  }

  // Abandoned listing
  if (item.status === ItemStatus.ABANDONED) {
    const abandonedListing = listing as AbandonedItemListing;

    if (userRole === LISTING_ROLES.HOST) {
      return {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        mainText: "Item abandoned",
        secondaryText: "Please remove this tag",
        additionalInfo: `Reason: ${abandonedListing.reason.reason}`,
      };
    }

    // For viewers and owners
    return {
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
      mainText: "Please take this tag to a member of staff",
      secondaryText: "This item is no longer available",
    };
  }

  // Sold listing
  if (item.status === ItemStatus.SOLD) {
    const soldListing = listing as SoldItemListing;

    if (userRole === LISTING_ROLES.HOST) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        mainText: "Item sold",
        secondaryText: "Please remove this tag",
        additionalInfo: `Sold on: ${formatDate(soldListing.sold_at)}`,
      };
    } else if (userRole === LISTING_ROLES.OWNER) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        mainText: "Your item has been sold",
        secondaryText: `Sold on: ${formatDate(soldListing.sold_at)}`,
      };
    }

    // For viewers
    return {
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
      mainText: "Please take this tag to a member of staff",
      secondaryText: "This item is no longer available",
    };
  }

  return null;
}
