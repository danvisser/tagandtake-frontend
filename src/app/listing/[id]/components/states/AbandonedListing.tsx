"use client";

import { ListingRole } from "@src/types/roles";
import { AbandonedItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";

interface AbandonedListingProps {
  listing: AbandonedItemListing;
  userRole: ListingRole | null;
  onRemoveTag: () => void;
  isRemoveTagLoading: boolean;
}

export default function AbandonedListing({
  listing,
  userRole,
  onRemoveTag,
  isRemoveTagLoading,
}: AbandonedListingProps) {
  const item = listing.item_details;

  if (!item) {
    return <div>Item details not available</div>;
  }

  const statusMessage = getStatusMessage(listing, userRole);

  return (
    <ListingCard
      listing={listing}
      statusBadge={{
        label: "Abandoned",
        variant: "destructive-inverse",
      }}
      statusMessage={statusMessage}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onRemoveTagFromAbandoned={onRemoveTag}
          isRemoveTagLoading={isRemoveTagLoading}
        />
      }
    />
  );
}
