"use client";

import { ListingRole } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
} from "@src/api/listingsApi";
import ActiveListing from "@src/app/listing/[id]/components/states/ActiveListing";
import RecalledListing from "@src/app/listing/[id]/components/states/RecalledListing";
import AbandonedListing from "@src/app/listing/[id]/components/states/AbandonedListing";
import VacantTag from "@src/app/listing/[id]/components/states/VacantTag";

type ListingType =
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | null;

interface WithListingStateProps {
  listing: ListingType;
  userRole: ListingRole;
  tagId?: number;
  onRemoveTag?: () => Promise<void>;
  onCheckout?: () => Promise<void>;
}

export default function WithListingState({
  listing,
  userRole,
  tagId,
  onRemoveTag,
  onCheckout,
}: WithListingStateProps) {
  // If we have no listing but have a tag ID, show the VacantTag component
  if (!listing && tagId) {
    return <VacantTag tagId={tagId} userRole={userRole} />;
  }

  // If we have no listing and no tag ID, show nothing
  if (!listing) {
    return null;
  }

  // Determine the listing type and render the appropriate component
  if ("recalled_at" in listing) {
    return <RecalledListing listing={listing} userRole={userRole} />;
  }

  if ("abandoned_at" in listing) {
    return (
      <AbandonedListing
        listing={listing}
        userRole={userRole}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  // Default to active listing
  return (
    <ActiveListing
      listing={listing}
      userRole={userRole}
      onCheckout={onCheckout}
    />
  );
}
