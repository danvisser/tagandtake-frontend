"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getListing,
  checkListingRole,
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { ListingRole } from "@src/types/roles";

export function useListingData() {
  const { id } = useParams();
  const listingId = typeof id === "string" ? parseInt(id) : 0;

  const [listing, setListing] = useState<
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | null
  >(null);
  const [userRole, setUserRole] = useState<ListingRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!listingId) {
        setError("Invalid listing ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch listing data
        const listingResponse = await getListing(listingId);
        if (!listingResponse.success) {
          throw new Error(listingResponse.error || "Failed to load listing");
        }

        // Fetch user role for this listing
        const roleResponse = await checkListingRole(listingId);
        if (!roleResponse.success) {
          throw new Error(roleResponse.error || "Failed to check user role");
        }

        setListing(listingResponse.data || null);
        setUserRole(roleResponse.data?.user_listing_relation || null);

        console.log("Listing data:", listingResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [listingId]);

  return {
    listing,
    userRole,
    isLoading,
    error,
  };
}
