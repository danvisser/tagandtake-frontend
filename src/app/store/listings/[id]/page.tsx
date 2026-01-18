"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle } from "lucide-react";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import {
  AbandonedItemListing,
  getStoreAbandonedListing,
  getStoreDelistedListingById,
  getStoreRecalledListing,
  getStoreSoldListing,
  RecalledItemListing,
  SoldItemListing,
  StoreDelistedListing,
} from "@src/api/listingsApi";
import { formatDate } from "@src/app/listing/[id]/utils/listingHelpers";
import { formatCurrency } from "@src/lib/formatters";
import { Routes } from "@src/constants/routes";
import { UserRoles } from "@src/types/roles";

type StoreListingTab = "recalled" | "sold" | "abandoned" | "delisted";
type StoreListingDetail =
  | RecalledItemListing
  | SoldItemListing
  | AbandonedItemListing
  | StoreDelistedListing;

export default function StoreListingDetailsPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreListingDetailsContent />
    </AuthenticatedPage>
  );
}

function StoreListingDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const id = Number(params.id);

  const normalizeTabParam = (tab: string | null): StoreListingTab | null => {
    if (tab === "recalled" || tab === "sold" || tab === "abandoned" || tab === "delisted") {
      return tab;
    }
    return null;
  };

  const tab = useMemo(() => normalizeTabParam(tabParam), [tabParam]);

  useEffect(() => {
    if (!tab) {
      // Avoid ambiguous IDs across different listing tables.
      // We require context (tab) to know which endpoint to call.
      // Links from the listings grid and legacy routes include this param.
      window.location.replace(Routes.STORE.LISTINGS.ROOT);
    }
  }, [tab]);

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<StoreListingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inferredTab = useMemo((): StoreListingTab | null => {
    if (!listing) return null;
    if ("collection_deadline" in listing) return "recalled";
    if ("sold_at" in listing) return "sold";
    if ("abandoned_at" in listing) return "abandoned";
    if ("delisted_at" in listing) return "delisted";
    return null;
  }, [listing]);

  const backTab = inferredTab ?? tab ?? "active";
  const backHref = `${Routes.STORE.LISTINGS.ROOT}?tab=${backTab}`;

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("Invalid listing id");
      setLoading(false);
      return;
    }

    if (!tab) return;

    const loadListing = async () => {
      setLoading(true);
      setError(null);

      try {
        if (tab === "recalled") {
          const result = await getStoreRecalledListing(id);
          if (result.success && result.data) {
            setListing(result.data);
            return;
          }
          setError(result.error || "Failed to load recalled listing");
          return;
        }

        if (tab === "sold") {
          const result = await getStoreSoldListing(id);
          if (result.success && result.data) {
            setListing(result.data);
            return;
          }
          setError(result.error || "Failed to load sold listing");
          return;
        }

        if (tab === "abandoned") {
          const result = await getStoreAbandonedListing(id);
          if (result.success && result.data) {
            setListing(result.data);
            return;
          }
          setError(result.error || "Failed to load abandoned listing");
          return;
        }

        if (tab === "delisted") {
          const result = await getStoreDelistedListingById(id);
          if (result.success && result.data) {
            const isDelistedRow = result.data.status === "delisted";
            if (!isDelistedRow) {
              setError("Delisted listing not found");
              return;
            }
            setListing(result.data);
            return;
          }
          setError(result.error || "Failed to load delisted listing");
          return;
        }

        setError("Invalid listing tab");
      } catch (err) {
        console.error("Error loading store listing:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id, tab]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <Link
            href={backHref}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Listings
          </Link>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <Link
            href={backHref}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Listings
          </Link>
        </div>
        <div className="text-destructive">{error || "Listing not found"}</div>
      </div>
    );
  }

  if ("collection_deadline" in listing) {
    const statusMessage = {
      icon: <AlertCircle className="h-5 w-5 text-destructive/50" />,
      mainText: "Item recalled",
      secondaryText: listing.collection_deadline
        ? `Must be collected by ${formatDate(listing.collection_deadline)}`
        : "Must be collected",
      additionalInfo: `Reason: ${listing.reason.reason}`,
    };

    return (
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <Link
            href={backHref}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Listings
          </Link>
        </div>
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

  if ("sold_at" in listing) {
    const statusMessage = {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      mainText: "Item sold",
      secondaryText: `Sold on ${formatDate(listing.sold_at)}`,
      additionalInfo: `Store commission: ${formatCurrency(listing.store_commission_amount)}${
        listing.tag_removed ? "" : " • Tag still attached"
      }`,
    };

    return (
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <Link
            href={backHref}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Listings
          </Link>
        </div>
        <div className="max-w-4xl mx-auto">
          <ListingCard
            listing={listing}
            statusBadge={{
              label: "Sold",
              variant: "secondary",
            }}
            statusMessage={statusMessage}
          />
        </div>
      </div>
    );
  }

  if ("status" in listing && listing.status === "delisted") {
    const statusMessage = {
      icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
      mainText: "Item delisted",
      secondaryText: listing.delisted_at
        ? `Delisted on ${formatDate(listing.delisted_at)}`
        : "Delisted",
      additionalInfo: listing.reason?.reason ? `Reason: ${listing.reason.reason}` : undefined,
    };

    return (
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <Link
            href={backHref}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Listings
          </Link>
        </div>
        <div className="max-w-4xl mx-auto">
          <ListingCard
            listing={listing}
            statusBadge={{
              label: "Delisted",
              variant: "secondary-inverse",
            }}
            statusMessage={statusMessage}
          />
        </div>
      </div>
    );
  }

  const statusMessage = {
    icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />,
    mainText: "Item abandoned",
    secondaryText: `Abandoned on ${formatDate(listing.abandoned_at)}`,
    additionalInfo: `Reason: ${listing.reason.reason}${
      listing.tag_removed ? "" : " • Tag still attached"
    }`,
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4">
        <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
          ← Back to Listings
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <ListingCard
          listing={listing}
          statusBadge={{
            label: "Abandoned",
            variant: "destructive",
          }}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
}
