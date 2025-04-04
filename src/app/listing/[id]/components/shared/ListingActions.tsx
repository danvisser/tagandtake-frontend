"use client";

import { useRouter } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
  VacantTag,
} from "@src/api/listingsApi";
import { Routes } from "@src/constants/routes";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { ItemStatus } from "@src/api/itemsApi";
import {
  isVacantTag,
  isItemListing,
} from "@src/app/listing/[id]/utils/listingHelpers";

interface ListingActionsProps {
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag
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

  if (!listing) {
    return null;
  }

  if (isVacantTag(listing)) {
    // Vacant tag logic
    if (userRole === LISTING_ROLES.HOST) {
      return (
        <Button
          onClick={() => router.push(Routes.STORE.LISTINGS.ROOT)}
          variant="outline"
          className="w-full"
        >
          Manage Store Listings
        </Button>
      );
    }

    if (listing.is_member) {
      return (
        <Button onClick={onOpenListItemModal} className="w-full">
          List an Item
        </Button>
      );
    }

    if (userRole === LISTING_ROLES.VIEWER) {
      return (
        <div className="flex flex-col gap-4 w-full">
          <Button onClick={() => router.push(Routes.LOGIN)} className="w-full">
            Login to List an Item
          </Button>
          <Button
            onClick={() => router.push(Routes.SIGNUP.MEMBER)}
            variant="outline"
            className="w-full"
          >
            Don&apos;t have an account? Sign up
          </Button>
        </div>
      );
    }
    
    return null;
  }

  if (isItemListing(listing)) {
    // Active listing
    if (listing.item_details?.status === ItemStatus.LISTED) {
      if (userRole === LISTING_ROLES.VIEWER) {
        return (
          <Button
            onClick={onCheckout}
            disabled={isCheckoutLoading}
            variant="secondary-inverse"
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
    if (listing.item_details?.status === ItemStatus.RECALLED) {
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
    if (listing.item_details?.status === ItemStatus.ABANDONED) {
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
    if (listing.item_details?.status === ItemStatus.SOLD) {
      const soldListing = listing as SoldItemListing;

      if (userRole === LISTING_ROLES.HOST && !soldListing.tag_removed) {
        return (
          <Button
            onClick={onRemoveTagFromSold}
            disabled={isRemoveTagLoading}
            className="w-full"
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
  }

  return null;
}
