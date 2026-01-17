"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@src/components/ui/tabs";
import { Button } from "@src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // Page state for each tab
  const [activePage, setActivePage] = useState(1);
  const [recalledPage, setRecalledPage] = useState(1);
  const [abandonedPage, setAbandonedPage] = useState(1);
  const [soldPage, setSoldPage] = useState(1);

  // State for each tab's listings
  const [activeListings, setActiveListings] = useState<ItemListing[]>([]);
  const [recalledListings, setRecalledListings] = useState<RecalledItemListing[]>([]);
  const [abandonedListings, setAbandonedListings] = useState<AbandonedItemListing[]>([]);
  const [soldListings, setSoldListings] = useState<SoldItemListing[]>([]);

  // Pagination metadata for each tab
  const [activePagination, setActivePagination] = useState<{
    count: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, total_pages: 1, next: null, previous: null });
  const [recalledPagination, setRecalledPagination] = useState<{
    count: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, total_pages: 1, next: null, previous: null });
  const [abandonedPagination, setAbandonedPagination] = useState<{
    count: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, total_pages: 1, next: null, previous: null });
  const [soldPagination, setSoldPagination] = useState<{
    count: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, total_pages: 1, next: null, previous: null });

  // Error states
  const [activeError, setActiveError] = useState<string | null>(null);
  const [recalledError, setRecalledError] = useState<string | null>(null);
  const [abandonedError, setAbandonedError] = useState<string | null>(null);
  const [soldError, setSoldError] = useState<string | null>(null);

  // Reset page when tab changes
  useEffect(() => {
    setActivePage(1);
    setRecalledPage(1);
    setAbandonedPage(1);
    setSoldPage(1);
  }, [activeTab]);

  // Load data when tab or page changes
  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);

      try {
        switch (activeTab) {
          case "active":
            const activeResult = await getStoreListings(activePage);
            if (activeResult.success && activeResult.data) {
              setActiveListings(activeResult.data.results);
              setActivePagination({
                count: activeResult.data.count || 0,
                total_pages: activeResult.data.total_pages || 1,
                next: activeResult.data.next || null,
                previous: activeResult.data.previous || null,
              });
              setActiveError(null);
            } else {
              setActiveError(activeResult.error || "Failed to load active listings");
            }
            break;
          case "recalled":
            const recalledResult = await getStoreRecalledListings(recalledPage);
            if (recalledResult.success && recalledResult.data) {
              setRecalledListings(recalledResult.data.results);
              setRecalledPagination({
                count: recalledResult.data.count || 0,
                total_pages: recalledResult.data.total_pages || 1,
                next: recalledResult.data.next || null,
                previous: recalledResult.data.previous || null,
              });
              setRecalledError(null);
            } else {
              setRecalledError(recalledResult.error || "Failed to load recalled listings");
            }
            break;
          case "abandoned":
            const abandonedResult = await getStoreAbandonedListings(abandonedPage);
            if (abandonedResult.success && abandonedResult.data) {
              setAbandonedListings(abandonedResult.data.results);
              setAbandonedPagination({
                count: abandonedResult.data.count || 0,
                total_pages: abandonedResult.data.total_pages || 1,
                next: abandonedResult.data.next || null,
                previous: abandonedResult.data.previous || null,
              });
              setAbandonedError(null);
            } else {
              setAbandonedError(abandonedResult.error || "Failed to load abandoned listings");
            }
            break;
          case "sold":
            const soldResult = await getStoreSoldListings(soldPage);
            if (soldResult.success && soldResult.data) {
              setSoldListings(soldResult.data.results);
              setSoldPagination({
                count: soldResult.data.count || 0,
                total_pages: soldResult.data.total_pages || 1,
                next: soldResult.data.next || null,
                previous: soldResult.data.previous || null,
              });
              setSoldError(null);
            } else {
              setSoldError(soldResult.error || "Failed to load sold listings");
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
  }, [activeTab, activePage, recalledPage, abandonedPage, soldPage]);

  // Pagination handlers
  const handleActivePreviousPage = () => {
    if (activePagination.previous) {
      setActivePage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleActiveNextPage = () => {
    if (activePagination.next) {
      setActivePage((prev) => {
        const newPage = prev + 1;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleRecalledPreviousPage = () => {
    if (recalledPagination.previous) {
      setRecalledPage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleRecalledNextPage = () => {
    if (recalledPagination.next) {
      setRecalledPage((prev) => {
        const newPage = prev + 1;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleAbandonedPreviousPage = () => {
    if (abandonedPagination.previous) {
      setAbandonedPage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleAbandonedNextPage = () => {
    if (abandonedPagination.next) {
      setAbandonedPage((prev) => {
        const newPage = prev + 1;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleSoldPreviousPage = () => {
    if (soldPagination.previous) {
      setSoldPage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleSoldNextPage = () => {
    if (soldPagination.next) {
      setSoldPage((prev) => {
        const newPage = prev + 1;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-normal mb-6">Store Listings</h1>

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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeListings.map((listing) => (
                  <ActiveListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              {activePagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {activeListings.length} of {activePagination.count}{" "}
                    {activePagination.count === 1 ? "listing" : "listings"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleActivePreviousPage}
                      disabled={!activePagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {activePage} of {activePagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleActiveNextPage}
                      disabled={!activePagination.next || loading}
                    >
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recalledListings.map((listing) => (
                  <RecalledListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              {recalledPagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {recalledListings.length} of {recalledPagination.count}{" "}
                    {recalledPagination.count === 1 ? "listing" : "listings"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRecalledPreviousPage}
                      disabled={!recalledPagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {recalledPage} of {recalledPagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRecalledNextPage}
                      disabled={!recalledPagination.next || loading}
                    >
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {soldListings.map((listing) => (
                  <SoldListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              {soldPagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {soldListings.length} of {soldPagination.count}{" "}
                    {soldPagination.count === 1 ? "listing" : "listings"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSoldPreviousPage}
                      disabled={!soldPagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {soldPage} of {soldPagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSoldNextPage}
                      disabled={!soldPagination.next || loading}
                    >
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {abandonedListings.map((listing) => (
                  <AbandonedListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              {abandonedPagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {abandonedListings.length} of {abandonedPagination.count}{" "}
                    {abandonedPagination.count === 1 ? "listing" : "listings"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAbandonedPreviousPage}
                      disabled={!abandonedPagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {abandonedPage} of {abandonedPagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAbandonedNextPage}
                      disabled={!abandonedPagination.next || loading}
                    >
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
