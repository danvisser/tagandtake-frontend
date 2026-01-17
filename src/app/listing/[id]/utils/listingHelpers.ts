import { ListingRole, ListingRoles } from "@src/types/roles";
import { UserRoles } from "@src/types/roles";
import {
  VacantTag,
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { ITEM_STATUS } from "@src/api/itemsApi";

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
    listingRole === ListingRoles.VIEWER
  );
}

/**
 * Determines if the user can checkout an item
 */
export function canCheckout(listingRole: ListingRole | null): boolean {
  // Only viewers can checkout
  return listingRole === ListingRoles.VIEWER;
}

/**
 * Formats a date string to a human-readable format like "2pm on 4 July" or "2pm on 4 July 2022" if not current year
 */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return "Unknown date";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const hours = date.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;

  // Only include the year if it's different from the current year
  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();
  const yearString = dateYear !== currentYear ? ` ${dateYear}` : "";

  return `${hour12}${ampm} on ${date.getDate()} ${date.toLocaleString("en-GB", { month: "long" })}${yearString}`;
}

/**
 * Gets the appropriate status badge for a listing
 */
export function getStatusBadge(status: string | undefined) {
  switch (status) {
    case ITEM_STATUS.LISTED:
      return { label: "Available", variant: "default" as const };
    case ITEM_STATUS.RECALLED:
      return { label: "Recalled", variant: "destructive" as const };
    case ITEM_STATUS.ABANDONED:
      return { label: "Abandoned", variant: "destructive" as const };
    case ITEM_STATUS.SOLD:
      return { label: "Sold", variant: "secondary" as const };
    default:
      return { label: "Unknown", variant: "outline" as const };
  }
}

export function isItemListing(
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag
    | null
): listing is
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | SoldItemListing {
  return Boolean(listing && "item_details" in listing);
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
