"use client";

import { useState } from "react";
import { ListingRole } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import ActiveListing from "./states/ActiveListing";
import RecalledListing from "./states/RecalledListing";
import AbandonedListing from "./states/AbandonedListing";
import SoldListing from "./states/SoldListing";
import VacantTag from "./states/VacantTag";
import CollectionModal from "./modals/CollectionModal";
import ListItemModal from "./modals/ListItemModal";
import CheckoutModal from "./modals/CheckoutModal";

interface WithListingStateProps {
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
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

  // Handle vacant tag
  if (!listing) {
    return (
      <>
        <VacantTag
          tagId={listingId}
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
  if (listing.item_details?.status === "listed") {
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
  if (listing.item_details?.status === "recalled") {
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
  if (listing.item_details?.status === "abandoned") {
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
  if (listing.item_details?.status === "sold") {
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
