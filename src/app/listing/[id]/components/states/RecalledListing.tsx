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

  let statusMessage = `This item has been recalled due to: ${listing.reason}`;

  if (userRole === LISTING_ROLES.OWNER) {
    statusMessage += `. Please collect by ${formatDate(listing.collection_deadline)}.`;
  }

  return (
    <ListingCard
      title={item.name}
      price={listing.item_price}
      condition={item.condition_details?.condition || "Unknown"}
      category={item.category_details?.name || "Unknown"}
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
