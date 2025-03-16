"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getListing,
  checkListingRole,
  removeTagFromAbandonedListing,
} from "@src/api/listingsApi";
import { ListingRole } from "@src/types/roles";
import WithListingState from "@src/app/listing/[id]/components/withListingState";
import ListingNavigation from "@src/app/listing/[id]/components/shared/ListingNavigation";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
} from "@src/api/listingsApi";

type ListingType =
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | null;

export default function ListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingType>(null);
  const [userRole, setUserRole] = useState<ListingRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListingAndRole = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First check the user's role for this listing
        const roleResult = await checkListingRole(Number(id));

        if (!roleResult.success || !roleResult.data) {
          setError(
            roleResult.error ||
              "Failed to determine your access to this listing"
          );
          setIsLoading(false);
          return;
        }

        setUserRole(roleResult.data.user_listing_relation);

        // If the listing exists, fetch its details
        if (roleResult.data.listing_exists) {
          const listingResult = await getListing(Number(id));

          if (!listingResult.success || !listingResult.data) {
            setError(listingResult.error || "Failed to load listing details");
            setIsLoading(false);
            return;
          }

          setListing(listingResult.data);
        } else {
          // No listing exists for this ID (might be just a tag)
          setListing(null);
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchListingAndRole();
    }
  }, [id]);

  // Handle tag removal for abandoned listings
  const handleRemoveTag = async () => {
    if (!listing || !("abandoned_at" in listing)) return;

    try {
      const result = await removeTagFromAbandonedListing(listing.id);
      if (result.success && result.data) {
        // Update the listing with the new data
        setListing(result.data);
      } else {
        setError(result.error || "Failed to remove tag");
      }
    } catch (err) {
      console.error("Error removing tag:", err);
      setError("An unexpected error occurred");
    }
  };

  // Handle checkout process
  const handleCheckout = async () => {
    // Implement Stripe checkout logic here
    console.log("Opening Stripe checkout for listing:", id);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">Error: {error}</div>;
  }

  if (!userRole) {
    return (
      <div className="container mx-auto p-4">
        Unable to determine your access to this listing
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ListingNavigation userRole={userRole} />

      <div className="max-w-md mx-auto">
        <WithListingState
          listing={listing}
          userRole={userRole}
          tagId={Number(id)}
          onRemoveTag={handleRemoveTag}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
