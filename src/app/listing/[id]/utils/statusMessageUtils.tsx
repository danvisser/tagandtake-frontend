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

export function getStatusMessage(
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag,
  userRole: ListingRole | null
) {
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
      return (
        <>
          <span>
            Please collect by {formatDate(recalledListing.collection_deadline)}
          </span>
          <br />
          <span className="mt-2 block text-muted-foreground">
            This item has been recalled due to: {recalledListing.reason.reason}
            <br />
            The item was recalled on {formatDate(recalledListing.recalled_at)}
            <br />
            Please collect by {formatDate(recalledListing.collection_deadline)}
          </span>
        </>
      );
    }

    if (userRole === LISTING_ROLES.HOST) {
      return (
        <>
          <span>
            This item has been recalled due to: {recalledListing.reason.reason}
          </span>
          <br />
          <span className="mt-2 block text-muted-foreground">
            The item was recalled on {formatDate(recalledListing.recalled_at)}
            <br />
            The item must be collected by{" "}
            {formatDate(recalledListing.collection_deadline)}
          </span>
        </>
      );
    }

    return `This item has been recalled due to: ${recalledListing.reason.reason}`;
  }

  // Abandoned listing
  if (item.status === ItemStatus.ABANDONED) {
    const abandonedListing = listing as AbandonedItemListing;

    if (userRole === LISTING_ROLES.HOST) {
      return (
        <span className="block text-muted-foreground">
          Recall reason: {abandonedListing.reason.reason}
          <br />
          <span className="mt-2 block">
            Abandoned on: {formatDate(abandonedListing.abandoned_at)}
          </span>
        </span>
      );
    }

    return (
      <>
        <span>Please ask a member of staff to remove the tag</span>
        <br />
        <span className="mt-2 block text-muted-foreground">
          The item was abandoned on {formatDate(abandonedListing.abandoned_at)}
        </span>
      </>
    );
  }

  // Sold listing
  if (item.status === ItemStatus.SOLD) {
    const soldListing = listing as SoldItemListing;

    if (userRole === LISTING_ROLES.HOST) {
      return (
        <>
          <span>Please remove the tag</span>
          <br />
          <span className="mt-2 block text-muted-foreground">
            This item was sold on {formatDate(soldListing.sold_at)}
          </span>
        </>
      );
    } else if (userRole === LISTING_ROLES.VIEWER) {
      return (
        <>
          <span>Please ask a member of staff to remove the tag</span>
          <br />
          <span className="mt-2 block text-muted-foreground">
            This item was sold on {formatDate(soldListing.sold_at)}
          </span>
        </>
      );
    }

    return `This item was sold on ${formatDate(soldListing.sold_at)}`;
  }

  return null;
}
