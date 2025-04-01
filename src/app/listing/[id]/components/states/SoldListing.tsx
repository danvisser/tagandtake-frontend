"use client";

import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { SoldItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";

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
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let statusMessage: string | React.ReactNode =
    `This item was sold on ${formatDate(listing.sold_at)}`;

  if (userRole === LISTING_ROLES.HOST && !listing.tag_removed) {
    statusMessage = (
      <>
        <span>Please remove the tag</span>
        <br />
        <span className="mt-2 block text-muted-foreground">
          This item was sold on {formatDate(listing.sold_at)}
        </span>
      </>
    );
  } else if (userRole === LISTING_ROLES.VIEWER && !listing.tag_removed) {
    statusMessage = (
      <>
        <span>Please ask staff to remove the tag</span>
        <br />
        <span className="mt-2 block text-muted-foreground">
          This item was sold on {formatDate(listing.sold_at)}
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
