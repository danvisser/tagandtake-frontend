"use client";

import { ListingRole } from "@src/types/roles";
import { SoldItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";

interface SoldListingProps {
  listing: SoldItemListing;
  userRole: ListingRole | null;
  onRemoveTag: () => void;
  isRemoveTagLoading: boolean;
}

export default function SoldListing({
  listing,
  userRole,
  onRemoveTag,
  isRemoveTagLoading,
}: SoldListingProps) {
  const item = listing.item_details;

  if (!item) {
    return <div>Item details not available</div>;
  }

  const statusMessage = getStatusMessage(listing, userRole);

  return (
    <ListingCard
      listing={listing}
      statusBadge={{
        label: "Sold",
        variant: "secondary",
      }}
      statusMessage={statusMessage}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onRemoveTagFromSold={onRemoveTag}
          isRemoveTagLoading={isRemoveTagLoading}
        />
      }
    />
  );
}
