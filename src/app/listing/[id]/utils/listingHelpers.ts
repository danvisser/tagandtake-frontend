import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { UserRoles } from "@src/types/roles";
import {
  VacantTag,
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { ItemStatus } from "@src/api/itemsApi";

/**
 * Determines if the user can list an item based on their role and authentication status
 */
export function canListItem(
  isAuthenticated: boolean,
  userRole: string | null,
  listingRole: ListingRole | null
): boolean {
  // Only authenticated member users who are viewing a vacant tag can list items
  return (
    isAuthenticated &&
    userRole === UserRoles.MEMBER &&
    listingRole === LISTING_ROLES.VIEWER
  );
}

/**
 * Determines if the user can checkout an item
 */
export function canCheckout(listingRole: ListingRole | null): boolean {
  // Only viewers can checkout
  return listingRole === LISTING_ROLES.VIEWER;
}

/**
 * Formats a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Gets the appropriate status badge for a listing
 */
export function getStatusBadge(status: string | undefined) {
  switch (status) {
    case ItemStatus.LISTED:
      return { label: "Available", variant: "default" as const };
    case ItemStatus.RECALLED:
      return { label: "Recalled", variant: "destructive" as const };
    case ItemStatus.ABANDONED:
      return { label: "Abandoned", variant: "destructive" as const };
    case ItemStatus.SOLD:
      return { label: "Sold", variant: "secondary" as const };
    default:
      return { label: "Unknown", variant: "outline" as const };
  }
}

export function isVacantTag(
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag
    | null
): listing is VacantTag {
  return Boolean(
    listing && "is_member" in listing && !("item_details" in listing)
  );
}
