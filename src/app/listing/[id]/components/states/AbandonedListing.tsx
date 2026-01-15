"use client";

import { ListingRole } from "@src/types/roles";
import { AbandonedItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";
import { ListingRoles } from "@src/types/roles";

interface AbandonedListingProps {
  listing: AbandonedItemListing;
  userRole: ListingRole | null;
  isRemoveTagLoading: boolean;
}

export default function AbandonedListing({
  listing,
  userRole,
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
        label: userRole === ListingRoles.HOST ? "Abandoned" : "Unavailable",
        variant: "destructive",
      }}
      statusMessage={statusMessage}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          isRemoveTagLoading={isRemoveTagLoading}
        />
      }
    />
  );
}
