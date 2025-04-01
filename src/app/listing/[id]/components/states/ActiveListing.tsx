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
      title={item.name}
      item_price={listing.item_price}
      listing_price={listing.listing_price}
      condition={item.condition_details?.condition || "Unknown"}
      conditionDescription={item.condition_details?.description}
      category={item.category_details?.name || "Unknown"}
      categoryDescription={item.category_details?.description}
      size={item.size}
      description={item.description}
      images={item.images || []}
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
