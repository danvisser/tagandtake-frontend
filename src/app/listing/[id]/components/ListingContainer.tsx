"use client";

import { useParams } from "next/navigation";
import { useListingData } from "@src/app/listing/[id]/hooks/useListingData";
import { useListingActions } from "@src/app/listing/[id]/hooks/useListingActions";
import WithListingState from "@src/app/listing/[id]/components/withListingState";
import ListingNavigation from "@src/app/listing/[id]/components/shared/ListingNavigation";
import LoadingSpinner from "@src/components/LoadingSpinner";

export default function ListingContainer() {
  const { id } = useParams();
  const listingId = typeof id === "string" ? parseInt(id) : 0;

  const { listing, userRole, isLoading, error } = useListingData();
  const actions = useListingActions(listingId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="md" text="Loading listing..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <ListingNavigation userRole={userRole} />

      <WithListingState
        listing={listing}
        userRole={userRole}
        listingId={listingId}
        actions={actions}
      />
    </div>
  );
}
