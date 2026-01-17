"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { getStoreAbandonedListing, AbandonedItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@src/app/listing/[id]/utils/listingHelpers";

export default function AbandonedListingDetailPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <AbandonedListingDetailContent />
    </AuthenticatedPage>
  );
}

function AbandonedListingDetailContent() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<AbandonedItemListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getStoreAbandonedListing(id);
        if (result.success && result.data) {
          setListing(result.data);
        } else {
          setError(result.error || "Failed to load abandoned listing");
        }
      } catch (err) {
        console.error("Error loading abandoned listing:", err);
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
    icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
    mainText: "Item abandoned",
    secondaryText: `Abandoned on ${formatDate(listing.abandoned_at)}`,
    additionalInfo: `Reason: ${listing.reason.reason}${listing.tag_removed ? " • Tag removed" : " • Tag still attached"}`,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ListingCard
          listing={listing}
          statusBadge={{
            label: "Abandoned",
            variant: "secondary",
          }}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
}
