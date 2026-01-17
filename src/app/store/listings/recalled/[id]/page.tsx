"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { getStoreRecalledListing, RecalledItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@src/app/listing/[id]/utils/listingHelpers";

export default function RecalledListingDetailPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <RecalledListingDetailContent />
    </AuthenticatedPage>
  );
}

function RecalledListingDetailContent() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<RecalledItemListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getStoreRecalledListing(id);
        if (result.success && result.data) {
          setListing(result.data);
        } else {
          setError(result.error || "Failed to load recalled listing");
        }
      } catch (err) {
        console.error("Error loading recalled listing:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadListing();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-destructive">{error || "Listing not found"}</div>
      </div>
    );
  }

  const statusMessage = {
    icon: <AlertCircle className="h-5 w-5 text-destructive/50" />,
    mainText: listing.collection_pin
      ? `Collection pin: ${listing.collection_pin}`
      : "Item recalled",
    secondaryText: listing.collection_deadline
      ? `Must be collected by ${formatDate(listing.collection_deadline)}`
      : "Must be collected",
    additionalInfo: `Reason: ${listing.reason.reason}`,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ListingCard
          listing={listing}
          statusBadge={{
            label: "Recalled",
            variant: "destructive",
          }}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
}
