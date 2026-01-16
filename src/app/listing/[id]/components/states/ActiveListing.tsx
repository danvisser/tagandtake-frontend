"use client";

import { ListingRole, ListingRoles } from "@src/types/roles";
import { ItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";

interface ActiveListingProps {
  listing: ItemListing;
  userRole: ListingRole | null;
  onOpenRecallModal?: () => void;
}

export default function ActiveListing({
  listing,
  userRole,
  onOpenRecallModal,
}: ActiveListingProps) {
  const item = listing.item_details;

  if (!item) {
    return <div>Item details not available</div>;
  }

  const statusMessage = getStatusMessage(listing, userRole);

  return (
    <ListingCard
      listing={listing}
      statusBadge={
        userRole === ListingRoles.VIEWER
          ? undefined
          : {
            label: "Available",
            variant: "default",
          }
      }
      statusMessage={statusMessage}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onOpenRecallModal={onOpenRecallModal}
        />
      }
    />
  );
}
