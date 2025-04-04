"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { ItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";

interface ActiveListingProps {
  listing: ItemListing;
  userRole: ListingRole | null;
  onCheckout: () => void;
  isCheckoutLoading: boolean;
}

export default function ActiveListing({
  listing,
  userRole,
  onCheckout,
  isCheckoutLoading,
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
        userRole === LISTING_ROLES.VIEWER
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
          onCheckout={onCheckout}
          isCheckoutLoading={isCheckoutLoading}
        />
      }
    />
  );
}
