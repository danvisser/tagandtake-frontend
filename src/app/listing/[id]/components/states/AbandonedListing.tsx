"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { AbandonedItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";
import { formatDate } from "../../utils/listingHelpers";

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

  let statusMessage: string | React.ReactNode = (
    <>
      <span>Please ask a member of staff to remove the tag</span>
      <br />
      <span className="mt-2 block text-muted-foreground">
        The item was abandoned on {formatDate(listing.abandoned_at)}
      </span>
    </>
  )

  if (userRole === LISTING_ROLES.HOST) {
    statusMessage = (
      <span className="block text-muted-foreground">
        Recall reason: {listing.reason.reason}
        <br />
        <span className="mt-2 block">
          Abandoned on: {formatDate(listing.abandoned_at)}
        </span>
      </span>
    );
  }

  return (
    <ListingCard
      listing={listing}
      statusBadge={{
        label: "Abandoned",
        variant: "destructive-inverse",
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
