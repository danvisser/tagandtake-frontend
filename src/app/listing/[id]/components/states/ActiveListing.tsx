"use client";

import { ListingRole } from "@src/types/roles";
import { ItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";

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

  return (
    <ListingCard
      listing={listing}
      statusBadge={{
        label: "Available",
        variant: "default",
      }}
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
