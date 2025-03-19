"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { SoldItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let statusMessage = `This item was sold on ${formatDate(listing.sold_at)}`;

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
