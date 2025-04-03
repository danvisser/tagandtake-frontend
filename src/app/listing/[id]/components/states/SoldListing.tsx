"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { SoldItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import { formatDate } from "../../utils/listingHelpers";

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

  let statusMessage: string | React.ReactNode =
    `This item was sold on ${formatDate(listing.sold_at)}`;

  if (userRole === LISTING_ROLES.HOST) {
    statusMessage = (
      <>
        <span>Please remove the tag</span>
        <br />
        <span className="mt-2 block text-muted-foreground">
          This item was sold on {formatDate(listing.sold_at)}
        </span>
      </>
    );
  } else if (userRole === LISTING_ROLES.VIEWER) {
    statusMessage = (
      <>
        <span>Please ask a member of staff to remove the tag</span>
        <br />
        <span className="mt-2 block text-muted-foreground">
          This item was sold on {formatDate(listing.sold_at)}
        </span>
      </>
    );
  }

  return (
    <ListingCard
      listing={listing}
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
