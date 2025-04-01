"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { RecalledItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let statusMessage: string | React.ReactNode =
    `This item has been recalled due to: ${listing.reason.reason}`;

  if (userRole === LISTING_ROLES.OWNER) {
    statusMessage = (
      <>
        <span>Please collect by {formatDate(listing.collection_deadline)}</span>
        <br />
        <span className="mt-2 block text-muted-foreground">
          This item has been recalled due to: {listing.reason.reason}
          <br />
          The item was recalled on {formatDate(listing.recalled_at)}
        </span>
      </>
    );
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
