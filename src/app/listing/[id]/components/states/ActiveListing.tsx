"use client";

import { ListingRole } from "@src/types/roles";
import { ItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";

interface ActiveListingProps {
  listing: ItemListing;
  userRole: ListingRole;
  onCheckout?: () => Promise<void>;
}

export default function ActiveListing({
  listing,
  userRole,
  onCheckout,
}: ActiveListingProps) {
  return (
    <ListingCard
      listing={listing}
      userRole={userRole}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onCheckout={onCheckout}
        />
      }
    />
  );
}
