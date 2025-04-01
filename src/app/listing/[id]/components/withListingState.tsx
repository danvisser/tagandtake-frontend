"use client";

import { useState } from "react";
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
import CollectionModal from "@src/app/listing/[id]/components/modals/CollectionModal";
import ListItemModal from "@src/app/listing/[id]/components/modals/ListItemModal";
import CheckoutModal from "@src/app/listing/[id]/components/modals/CheckoutModal";
import { isVacantTag } from "@src/app/listing/[id]/utils/listingHelpers";
import { ItemStatus } from "@src/api/itemsApi";

interface WithListingStateProps {
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag
    | null;
  userRole: ListingRole | null;
  listingId: number;
  actions: {
    handleCheckout: () => void;
    handleRemoveTagFromAbandoned: () => void;
    handleRemoveTagFromSold: () => void;
    handleCollect: (pin: string) => void;
    isCheckoutLoading: boolean;
    isRemoveTagLoading: boolean;
    isCollectLoading: boolean;
  };
}

export default function WithListingState({
  listing,
  userRole,
  listingId,
  actions,
}: WithListingStateProps) {
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!listing) {
    return null;
  }

  // Handle vacant tag
  if (isVacantTag(listing)) {
    return (
      <>
        <VacantTagState
          listing={listing}
          userRole={userRole}
          onOpenListItemModal={() => setIsListItemModalOpen(true)}
        />

        <ListItemModal
          isOpen={isListItemModalOpen}
          onClose={() => setIsListItemModalOpen(false)}
          tagId={listingId}
        />
      </>
    );
  }

  // Handle active listing
  if (listing.item_details?.status === ItemStatus.LISTED) {
    const activeListing = listing as ItemListing;

    return (
      <>
        <ActiveListing
          listing={activeListing}
          userRole={userRole}
          onCheckout={() => setIsCheckoutModalOpen(true)}
          isCheckoutLoading={actions.isCheckoutLoading}
        />

        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          listingId={listingId}
        />
      </>
    );
  }

  // Handle recalled listing
  if (listing.item_details?.status === ItemStatus.RECALLED) {
    const recalledListing = listing as RecalledItemListing;

    return (
      <>
        <RecalledListing
          listing={recalledListing}
          userRole={userRole}
          onOpenCollectionModal={() => setIsCollectionModalOpen(true)}
          isCollectLoading={actions.isCollectLoading}
        />

        <CollectionModal
          isOpen={isCollectionModalOpen}
          onClose={() => setIsCollectionModalOpen(false)}
          onCollect={actions.handleCollect}
          isLoading={actions.isCollectLoading}
        />
      </>
    );
  }

  // Handle abandoned listing
  if (listing.item_details?.status === ItemStatus.ABANDONED) {
    const abandonedListing = listing as AbandonedItemListing;

    return (
      <AbandonedListing
        listing={abandonedListing}
        userRole={userRole}
        onRemoveTag={actions.handleRemoveTagFromAbandoned}
        isRemoveTagLoading={actions.isRemoveTagLoading}
      />
    );
  }

  // Handle sold listing
  if (listing.item_details?.status === ItemStatus.SOLD) {
    const soldListing = listing as SoldItemListing;

    return (
      <SoldListing
        listing={soldListing}
        userRole={userRole}
        onRemoveTag={actions.handleRemoveTagFromSold}
        isRemoveTagLoading={actions.isRemoveTagLoading}
      />
    );
  }

  // Fallback
  return <div>Unknown listing state</div>;
}
