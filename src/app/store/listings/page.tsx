"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@src/components/ui/tabs";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import {
  getStoreListings,
  getStoreRecalledListings,
  getStoreAbandonedListings,
  getStoreSoldListings,
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { PaginatedResponse } from "@src/types/api";
import ActiveListingCard from "./components/ActiveListingCard";
import RecalledListingCard from "./components/RecalledListingCard";
import AbandonedListingCard from "./components/AbandonedListingCard";
import SoldListingCard from "./components/SoldListingCard";

export default function StoreListings() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreListingsContent />
    </AuthenticatedPage>
  );
}

function StoreListingsContent() {
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);

  // State for each tab's listings
  const [activeListings, setActiveListings] = useState<ItemListing[]>([]);
  const [recalledListings, setRecalledListings] = useState<RecalledItemListing[]>([]);
  const [abandonedListings, setAbandonedListings] = useState<AbandonedItemListing[]>([]);
  const [soldListings, setSoldListings] = useState<SoldItemListing[]>([]);

  // Error states
  const [activeError, setActiveError] = useState<string | null>(null);
  const [recalledError, setRecalledError] = useState<string | null>(null);
  const [abandonedError, setAbandonedError] = useState<string | null>(null);
  const [soldError, setSoldError] = useState<string | null>(null);

  // Load data when tab changes
  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);

      try {
        switch (activeTab) {
          case "active":
            if (activeListings.length === 0) {
              const activeResult = await getStoreListings();
              if (activeResult.success && activeResult.data) {
                setActiveListings(activeResult.data.results);
                setActiveError(null);
              } else {
                setActiveError(activeResult.error || "Failed to load active listings");
              }
            }
            break;
          case "recalled":
            if (recalledListings.length === 0) {
              const recalledResult = await getStoreRecalledListings();
              if (recalledResult.success && recalledResult.data) {
                setRecalledListings(recalledResult.data.results);
                setRecalledError(null);
              } else {
                setRecalledError(recalledResult.error || "Failed to load recalled listings");
              }
            }
            break;
          case "abandoned":
            if (abandonedListings.length === 0) {
              const abandonedResult = await getStoreAbandonedListings();
              if (abandonedResult.success && abandonedResult.data) {
                // Handle both array and paginated response
                let listings: AbandonedItemListing[] = [];
                if (Array.isArray(abandonedResult.data)) {
                  listings = abandonedResult.data;
                } else if (abandonedResult.data && typeof abandonedResult.data === 'object' && 'results' in abandonedResult.data) {
                  listings = (abandonedResult.data as PaginatedResponse<AbandonedItemListing>).results || [];
                }
                setAbandonedListings(listings);
                setAbandonedError(null);
              } else {
                setAbandonedError(abandonedResult.error || "Failed to load abandoned listings");
              }
            }
            break;
          case "sold":
            if (soldListings.length === 0) {
              const soldResult = await getStoreSoldListings();
              if (soldResult.success && soldResult.data) {
                // Handle both array and paginated response
                let listings: SoldItemListing[] = [];
                if (Array.isArray(soldResult.data)) {
                  listings = soldResult.data;
                } else if (soldResult.data && typeof soldResult.data === 'object' && 'results' in soldResult.data) {
                  listings = (soldResult.data as PaginatedResponse<SoldItemListing>).results || [];
                }
                setSoldListings(listings);
                setSoldError(null);
              } else {
                setSoldError(soldResult.error || "Failed to load sold listings");
              }
            }
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} listings:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Store Listings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="recalled">Recalled</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
          <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : activeError ? (
            <div className="text-destructive">{activeError}</div>
          ) : activeListings.length === 0 ? (
            <div className="text-muted-foreground">No active listings</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeListings.map((listing) => (
                <ActiveListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recalled" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : recalledError ? (
            <div className="text-destructive">{recalledError}</div>
          ) : recalledListings.length === 0 ? (
            <div className="text-muted-foreground">No recalled listings</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recalledListings.map((listing) => (
                <RecalledListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : soldError ? (
            <div className="text-destructive">{soldError}</div>
          ) : soldListings.length === 0 ? (
            <div className="text-muted-foreground">No sold listings</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soldListings.map((listing) => (
                <SoldListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="abandoned" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : abandonedError ? (
            <div className="text-destructive">{abandonedError}</div>
          ) : abandonedListings.length === 0 ? (
            <div className="text-muted-foreground">No abandoned listings</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {abandonedListings.map((listing) => (
                <AbandonedListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
