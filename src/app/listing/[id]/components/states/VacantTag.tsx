"use client";

import { ListingRole } from "@src/types/roles";
import VacantTagCard from "../shared/VacantTagCard";
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
    <VacantTagCard
      listing={listing}
      statusBadge={{
        label: "Available for Listing",
        variant: "outline",
      }}
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
