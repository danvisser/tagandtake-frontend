"use client";

import { ListingRole } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
  VacantTag,
} from "@src/api/listingsApi";
import ActiveListing from "@src/app/listing/[id]/components/states/ActiveListing";
import RecalledListing from "@src/app/listing/[id]/components/states/RecalledListing";
import AbandonedListing from "@src/app/listing/[id]/components/states/AbandonedListing";
import SoldListing from "@src/app/listing/[id]/components/states/SoldListing";
import VacantTagState from "@src/app/listing/[id]/components/states/VacantTag";
import TagNotFound from "@src/app/listing/[id]/components/states/TagNotFound";
import { isVacantTag } from "@src/app/listing/[id]/utils/listingHelpers";
import { ITEM_STATUS } from "@src/api/itemsApi";
import { useListingContext } from "../context/ListingContext";

interface WithListingStateProps {
  listing:
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | SoldItemListing
  | VacantTag
  | null;
  userRole: ListingRole | null;
}

export default function WithListingState({
  listing,
  userRole,
}: WithListingStateProps) {
  const { setIsCollectionModalOpen, setIsListItemModalOpen, setIsManageListingModalOpen, actions } =
    useListingContext();

  if (!listing) {
    return <TagNotFound />;
  }

  // Handle vacant tag
  if (isVacantTag(listing)) {
    return (
      <VacantTagState
        listing={listing}
        userRole={userRole}
        onOpenListItemModal={() => setIsListItemModalOpen(true)}
      />
    );
  }

  // Handle active listing
  if (listing.item_details?.status === ITEM_STATUS.LISTED) {
    const activeListing = listing as ItemListing;

    return (
      <ActiveListing
        listing={activeListing}
        userRole={userRole}
        onOpenManageListingModal={() => setIsManageListingModalOpen(true)}
      />
    );
  }

  // Handle recalled listing
  if (listing.item_details?.status === ITEM_STATUS.RECALLED) {
    const recalledListing = listing as RecalledItemListing;

    return (
      <RecalledListing
        listing={recalledListing}
        userRole={userRole}
        onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
        isCollectLoading={actions.isCollectLoading}
      />
    );
  }

  // Handle abandoned listing
  if (listing.item_details?.status === ITEM_STATUS.ABANDONED) {
    const abandonedListing = listing as AbandonedItemListing;

    return (
      <AbandonedListing
        listing={abandonedListing}
        userRole={userRole}
        isRemoveTagLoading={actions.isRemoveTagLoading}
      />
    );
  }

  // Handle sold listing
  if (listing.item_details?.status === ITEM_STATUS.SOLD) {
    const soldListing = listing as SoldItemListing;

    return (
      <SoldListing
        listing={soldListing}
        userRole={userRole}
        isRemoveTagLoading={actions.isRemoveTagLoading}
      />
    );
  }

  // Fallback
  return <div>Unknown listing state</div>;
}
