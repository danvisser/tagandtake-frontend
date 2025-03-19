"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { AbandonedItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";

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

  let statusMessage = `This item has been abandoned due to: ${listing.reason.reason}`;

  if (userRole === LISTING_ROLES.HOST && !listing.tag_removed) {
    statusMessage +=
      ". Please remove the tag to make it available for new listings.";
  } else if (listing.tag_removed) {
    statusMessage += ". The tag has been removed.";
  }

  return (
    <ListingCard
      title={item.name}
      price={listing.listing_price}
      condition={item.condition_details?.condition || "Unknown"}
      category={item.category_details?.name || "Unknown"}
      images={item.images || []}
      statusBadge={{
        label: "Abandoned",
        variant: "destructive",
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
