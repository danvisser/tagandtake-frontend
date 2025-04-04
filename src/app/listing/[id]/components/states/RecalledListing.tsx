"use client";

import { ListingRole } from "@src/types/roles";
import { RecalledItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";
import { getStatusMessage } from "../../utils/statusMessageUtils";

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
        variant: "destructive",
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
