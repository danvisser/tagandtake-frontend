"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { getStoreSoldListing, SoldItemListing } from "@src/api/listingsApi";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "@src/lib/formatters";
import { formatDate } from "@src/app/listing/[id]/utils/listingHelpers";

export default function SoldListingDetailPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <SoldListingDetailContent />
    </AuthenticatedPage>
  );
}

function SoldListingDetailContent() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<SoldItemListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getStoreSoldListing(id);
        if (result.success && result.data) {
          setListing(result.data);
        } else {
          setError(result.error || "Failed to load sold listing");
        }
      } catch (err) {
        console.error("Error loading sold listing:", err);
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
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    mainText: "Item sold",
    secondaryText: `Sold on ${formatDate(listing.sold_at)}`,
    additionalInfo: `Store commission: ${formatCurrency(listing.store_commission_amount)}${listing.tag_removed ? " • Tag removed" : " • Tag still attached"}`,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ListingCard
          listing={listing}
          statusBadge={{
            label: "Sold",
            variant: "default",
          }}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
}
