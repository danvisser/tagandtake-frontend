"use client";

import { ListingRole } from "@src/types/roles";
import { RecalledItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";

interface RecalledListingProps {
  listing: RecalledItemListing;
  userRole: ListingRole | null;
  onOpenCollectionModal: () => void;
  isCollectLoading: boolean;
}

export default function RecalledListing({
  listing,
  userRole,
  onOpenCollectionModal,
  isCollectLoading,
}: RecalledListingProps) {
  const item = listing.item_details;

  if (!item) {
    return <div>Item details not available</div>;
  }

  const statusMessage = getStatusMessage(listing, userRole);

  return (
    <ListingCard
      listing={listing}
      statusBadge={{
        label: "Recalled",
        variant: "destructive-inverse",
      }}
      statusMessage={statusMessage}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onOpenCollectionModal={onOpenCollectionModal}
          isCollectLoading={isCollectLoading}
        />
      }
    />
  );
}
