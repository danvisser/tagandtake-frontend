"use client";

import { useRouter } from "next/navigation";
import { Button } from "@src/components/ui/button";
import { ListingRole, ListingRoles } from "@src/types/roles";
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
import { useListingContext } from "@src/app/listing/[id]/context/ListingContext";
import StripeCheckoutButton from "@src/app/listing/[id]/components/StripeCheckoutButton";

interface ListingActionsProps {
  listing:
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | SoldItemListing
  | VacantTag
  | null;
  userRole: ListingRole | null;
  onOpenCollectionModal?: () => void;
  onOpenListItemModal?: () => void;
  isRemoveTagLoading?: boolean;
  isCollectLoading?: boolean;
}

export default function ListingActions({
  listing,
  userRole,
  onOpenCollectionModal,
  onOpenListItemModal,
  isRemoveTagLoading,
  isCollectLoading,
}: ListingActionsProps) {
  const router = useRouter();
  const {
    setIsRemoveTagFromAbandonedModalOpen,
    setIsRemoveTagFromSoldModalOpen,
  } = useListingContext();

  if (!listing) {
    return null;
  }

  if (isVacantTag(listing)) {
    // Vacant tag logic
    if (userRole === ListingRoles.HOST) {
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

    // If the store is at capacity, don't show listing buttons
    if (!listing.has_capacity) {
      return null;
    }

    if (listing.is_member) {
      return (
        <Button onClick={onOpenListItemModal} className="w-full">
          List an Item
        </Button>
      );
    }

    if (userRole === ListingRoles.VIEWER) {
      return (
        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => {
              // Store the current path as the return path
              sessionStorage.setItem("returnPath", window.location.pathname);
              router.push(Routes.LOGIN);
            }}
            className="w-full"
          >
            Login to list an item
          </Button>
          <Button
            onClick={() => {
              // Store the current path as the return path
              sessionStorage.setItem("returnPath", window.location.pathname);
              router.push(Routes.SIGNUP.MEMBER);
            }}
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
      if (userRole === ListingRoles.VIEWER) {
        return (
          <StripeCheckoutButton
            tagId={listing.tag}
            buttonText="Buy Now"
            buttonVariant="secondary-inverse"
            buttonClassName="w-full"
          />
        );
      }

      if (userRole === ListingRoles.OWNER) {
        return (
          <Button
            onClick={() => {
              // Store the current path as the return path
              sessionStorage.setItem("returnPath", window.location.pathname);
              router.push(Routes.MEMBER.ITEMS.DETAILS(listing.item.toString()));
            }}
            variant="outline"
            className="w-full"
          >
            Manage Item
          </Button>
        );
      }

      if (userRole === ListingRoles.HOST) {
        return (
          <Button
            onClick={() => {
              // Store the current path as the return path
              sessionStorage.setItem("returnPath", window.location.pathname);
              router.push(Routes.STORE.LISTINGS.DETAILS(listing.id.toString()));
            }}
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
      if (userRole === ListingRoles.HOST) {
        return (
          <Button
            onClick={onOpenCollectionModal}
            disabled={isCollectLoading}
            className="w-full"
          >
            {isCollectLoading ? (
              <LoadingSpinner size="sm" text="Processing..." />
            ) : (
              "Confirm Collection"
            )}
          </Button>
        );
      }

      if (userRole === ListingRoles.OWNER) {
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

      if (userRole === ListingRoles.HOST && !abandonedListing.tag_removed) {
        return (
          <Button
            onClick={() => setIsRemoveTagFromAbandonedModalOpen(true)}
            disabled={isRemoveTagLoading}
            className="w-full"
            variant="destructive"
          >
            {isRemoveTagLoading ? (
              <LoadingSpinner size="sm" text="Processing..." />
            ) : (
              "Delist Item"
            )}
          </Button>
        );
      }
    }

    // Sold listing
    if (listing.item_details?.status === ItemStatus.SOLD) {
      const soldListing = listing as SoldItemListing;

      if (userRole === ListingRoles.HOST && !soldListing.tag_removed) {
        return (
          <Button
            onClick={() => setIsRemoveTagFromSoldModalOpen(true)}
            disabled={isRemoveTagLoading}
            className="w-full"
          >
            {isRemoveTagLoading ? (
              <LoadingSpinner size="sm" text="Processing..." />
            ) : (
              "Confirm Sale"
            )}
          </Button>
        );
      }
    }
  }

  return null;
}
