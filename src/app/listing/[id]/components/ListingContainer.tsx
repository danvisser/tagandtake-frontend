"use client";

import { useParams } from "next/navigation";
import { useListingData } from "../hooks/useListingData";
import { useListingActions } from "../hooks/useListingActions";
import WithListingState from "./withListingState";
import ListingNavigation from "./shared/ListingNavigation";
import { Loader2 } from "lucide-react";

export default function ListingContainer() {
  const { id } = useParams();
  const listingId = typeof id === "string" ? parseInt(id) : 0;

  const { listing, userRole, isLoading, error } = useListingData();
  const actions = useListingActions(listingId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading listing...</p>
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
