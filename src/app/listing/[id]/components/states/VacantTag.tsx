"use client";

import { ListingRole } from "@src/types/roles";
import VacantTagCard from "../shared/VacantTagCard";
import ListingActions from "../shared/ListingActions";
import type { VacantTag } from "@src/api/listingsApi";
import { getStatusMessage } from "../../utils/statusMessageUtils";

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
  const statusMessage = getStatusMessage(listing, userRole);

  return (
    <VacantTagCard
      listing={listing}
      statusBadge={{
        label: "Available for Listing",
        variant: "outline",
      }}
      statusMessage={statusMessage}
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
