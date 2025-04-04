"use client";

import { ListingRole } from "@src/types/roles";
import VacantTagCard from "@src/app/listing/[id]/components/shared/VacantTagCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
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
      userRole={userRole}
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
