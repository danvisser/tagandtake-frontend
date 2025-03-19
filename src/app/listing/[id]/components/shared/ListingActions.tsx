"use client";

import { useRouter } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { Routes } from "@src/constants/routes";
import { useAuthStore } from "@src/stores/authStore";
import { UserRoles } from "@src/types/roles";
import LoadingSpinner from "@src/components/LoadingSpinner";

interface ListingActionsProps {
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | null;
  userRole: ListingRole | null;
  onCheckout?: () => void;
  onRemoveTagFromAbandoned?: () => void;
  onRemoveTagFromSold?: () => void;
  onOpenCollectionModal?: () => void;
  onOpenListItemModal?: () => void;
  isCheckoutLoading?: boolean;
  isRemoveTagLoading?: boolean;
  isCollectLoading?: boolean;
  tagId?: number;
}

export default function ListingActions({
  listing,
  userRole,
  onCheckout,
  onRemoveTagFromAbandoned,
  onRemoveTagFromSold,
  onOpenCollectionModal,
  onOpenListItemModal,
  isCheckoutLoading,
  isRemoveTagLoading,
  isCollectLoading,
}: ListingActionsProps) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();

  if (!listing) {
    // Vacant tag
    if (userRole === LISTING_ROLES.HOST) {
      return (
        <Button
          onClick={() => router.push(Routes.STORE.LISTINGS.ROOT)}
          className="w-full"
        >
          Manage Store Listings
        </Button>
      );
    }

    if (!isAuthenticated) {
      return (
        <Button onClick={() => router.push(Routes.LOGIN)} className="w-full">
          Login to List Item
        </Button>
      );
    }

    if (role === UserRoles.STORE) {
      return (
        <Button
          onClick={() => router.push(Routes.STORE.DASHBOARD)}
          className="w-full"
        >
          Go to Store Dashboard
        </Button>
      );
    }

    if (role === UserRoles.MEMBER) {
      return (
        <Button onClick={onOpenListItemModal} className="w-full">
          List an Item
        </Button>
      );
    }

    return null;
  }

  // Active listing
  if (listing.item_details?.status === "listed") {
    if (userRole === LISTING_ROLES.VIEWER) {
      return (
        <Button
          onClick={onCheckout}
          disabled={isCheckoutLoading}
          className="w-full"
        >
          {isCheckoutLoading ? (
            <LoadingSpinner size="sm" text="Processing..." />
          ) : (
            "Buy Now"
          )}
        </Button>
      );
    }

    if (userRole === LISTING_ROLES.OWNER) {
      return (
        <Button
          onClick={() =>
            router.push(Routes.MEMBER.ITEMS.DETAILS(listing.item.toString()))
          }
          variant="outline"
          className="w-full"
        >
          Manage Item
        </Button>
      );
    }

    if (userRole === LISTING_ROLES.HOST) {
      return (
        <Button
          onClick={() =>
            router.push(Routes.STORE.LISTINGS.MANAGE(listing.id.toString()))
          }
          variant="outline"
          className="w-full"
        >
          Manage Listing
        </Button>
      );
    }
  }

  // Recalled listing
  if (listing.item_details?.status === "recalled") {
    if (userRole === LISTING_ROLES.HOST) {
      return (
        <Button
          onClick={onOpenCollectionModal}
          disabled={isCollectLoading}
          className="w-full"
        >
          {isCollectLoading ? (
            <LoadingSpinner size="sm" text="Processing..." />
          ) : (
            "Collect Item"
          )}
        </Button>
      );
    }

    if (userRole === LISTING_ROLES.OWNER) {
      return (
        <Button variant="outline" className="w-full" disabled>
          Awaiting Collection
        </Button>
      );
    }
  }

  // Abandoned listing
  if (listing.item_details?.status === "abandoned") {
    const abandonedListing = listing as AbandonedItemListing;

    if (userRole === LISTING_ROLES.HOST && !abandonedListing.tag_removed) {
      return (
        <Button
          onClick={onRemoveTagFromAbandoned}
          disabled={isRemoveTagLoading}
          className="w-full"
          variant="destructive"
        >
          {isRemoveTagLoading ? (
            <LoadingSpinner size="sm" text="Processing..." />
          ) : (
            "Remove Tag"
          )}
        </Button>
      );
    }
  }

  // Sold listing
  if (listing.item_details?.status === "sold") {
    const soldListing = listing as SoldItemListing;

    if (userRole === LISTING_ROLES.HOST && !soldListing.tag_removed) {
      return (
        <Button
          onClick={onRemoveTagFromSold}
          disabled={isRemoveTagLoading}
          className="w-full"
          variant="destructive"
        >
          {isRemoveTagLoading ? (
            <LoadingSpinner size="sm" text="Processing..." />
          ) : (
            "Remove Tag"
          )}
        </Button>
      );
    }
  }

  return null;
}
