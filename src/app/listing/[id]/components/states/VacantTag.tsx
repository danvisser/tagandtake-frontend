"use client";

import { ListingRole } from "@src/types/roles";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";
import type { VacantTag } from "@src/api/listingsApi";

interface VacantTagProps {
  listing: VacantTag;
  userRole: ListingRole | null;
  onOpenListItemModal: () => void;
}

export default function NoListing({
  listing,
  userRole,
  onOpenListItemModal,
}: VacantTagProps) {
  return (
    <ListingCard
      title="Vacant Tag"
      price={0}
      condition="N/A"
      category="N/A"
      images={[]}
      statusBadge={{
        label: "Available for Listing",
        variant: "outline",
      }}
      statusMessage="This tag is currently vacant and available for listing an item."
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onOpenListItemModal={onOpenListItemModal}
        />
      }
    />
  );
}
