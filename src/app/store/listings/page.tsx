"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@src/components/ui/tabs";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { Routes } from "@src/constants/routes";
import {
  getStoreListings,
  getStoreRecalledListings,
  getStoreDelistedListings,
  getStoreSoldListings,
  ItemListing,
  RecalledItemListing,
  SoldItemListing,
  StoreDelistedListing,
} from "@src/api/listingsApi";
import ActiveListingCard from "./components/ActiveListingCard";
import RecalledListingCard from "./components/RecalledListingCard";
import DelistedListingCard from "@src/app/store/listings/components/DelistedListingCard";
import SoldListingCard from "./components/SoldListingCard";

export default function StoreListings() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreListingsContent />
    </AuthenticatedPage>
  );
}

function StoreListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const normalizeTabParam = (
    tab: string | null
  ): "active" | "recalled" | "sold" | "delisted" | null => {
    if (tab === "abandoned") return "delisted";
    if (tab === "active" || tab === "recalled" || tab === "sold" || tab === "delisted") {
      return tab;
    }
    return null;
  };

  const initialTab = useMemo(
    () => normalizeTabParam(tabParam) ?? "active",
    [tabParam]
  );

  const [activeTab, setActiveTab] = useState<"active" | "recalled" | "sold" | "delisted">(initialTab);
  const [loading, setLoading] = useState(true);

  // Page state for each tab
  const [activePage, setActivePage] = useState(1);
  const [recalledPage, setRecalledPage] = useState(1);
  const [delistedPage, setDelistedPage] = useState(1);
  const [soldPage, setSoldPage] = useState(1);

  // State for each tab's listings
  const [activeListings, setActiveListings] = useState<ItemListing[]>([]);
  const [recalledListings, setRecalledListings] = useState<RecalledItemListing[]>([]);
  const [delistedListings, setDelistedListings] = useState<StoreDelistedListing[]>([]);
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
  const [delistedPagination, setDelistedPagination] = useState<{
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
  const [delistedError, setDelistedError] = useState<string | null>(null);
  const [soldError, setSoldError] = useState<string | null>(null);

  const [delistedNeedsTagRemovedCount, setDelistedNeedsTagRemovedCount] = useState(0);
  const [pastMinListingDaysCount, setPastMinListingDaysCount] = useState(0);
  const [soldTagAttachedCount, setSoldTagAttachedCount] = useState(0);

  useEffect(() => {
    const normalized = normalizeTabParam(tabParam);
    if (normalized && normalized !== activeTab) {
      setActiveTab(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      try {
        const [delistedCount, pastMinDaysCount, soldCount] = await Promise.all([
          (async () => {
            let page = 1;
            let totalPages = 1;
            let count = 0;

            while (page <= totalPages) {
              const result = await getStoreDelistedListings(page);
              if (!result.success || !result.data) break;

              totalPages = result.data.total_pages || 1;
              count += result.data.results.filter((l) => {
                if (l.status !== "abandoned") return false;
                return l.tag_removed === false || l.needs_tag_removed === true;
              }).length;
              page += 1;
            }

            return count;
          })(),
          (async () => {
            let page = 1;
            let totalPages = 1;
            let count = 0;

            while (page <= totalPages) {
              const result = await getStoreListings(page);
              if (!result.success || !result.data) break;

              totalPages = result.data.total_pages || 1;
              count += result.data.results.filter((l) => l.past_min_listing_days).length;
              page += 1;
            }

            return count;
          })(),
          (async () => {
            let page = 1;
            let totalPages = 1;
            let count = 0;

            while (page <= totalPages) {
              const result = await getStoreSoldListings(page);
              if (!result.success || !result.data) break;

              totalPages = result.data.total_pages || 1;
              count += result.data.results.filter((l) => l.tag_removed === false).length;
              page += 1;
            }

            return count;
          })(),
        ]);

        if (cancelled) return;
        setDelistedNeedsTagRemovedCount(delistedCount);
        setPastMinListingDaysCount(pastMinDaysCount);
        setSoldTagAttachedCount(soldCount);
      } catch (error) {
        console.error("Error loading listing counts:", error);
      }
    };

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Reset page when tab changes
  useEffect(() => {
    setActivePage(1);
    setRecalledPage(1);
    setDelistedPage(1);
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
              const sorted = [...activeResult.data.results].sort((a, b) => {
                const at = new Date(a.created_at).getTime();
                const bt = new Date(b.created_at).getTime();
                return at - bt;
              });
              setActiveListings(sorted);
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
          case "delisted":
            const delistedResult = await getStoreDelistedListings(delistedPage);
            if (delistedResult.success && delistedResult.data) {
              const sorted = [...delistedResult.data.results].sort((a, b) => {
                const aNeeds =
                  a.status === "abandoned" &&
                  (a.tag_removed === false || a.needs_tag_removed === true);
                const bNeeds =
                  b.status === "abandoned" &&
                  (b.tag_removed === false || b.needs_tag_removed === true);
                if (aNeeds !== bNeeds) return aNeeds ? -1 : 1;

                const at = new Date(a.event_at).getTime();
                const bt = new Date(b.event_at).getTime();
                return bt - at;
              });

              setDelistedListings(sorted);
              setDelistedPagination({
                count: delistedResult.data.count || 0,
                total_pages: delistedResult.data.total_pages || 1,
                next: delistedResult.data.next || null,
                previous: delistedResult.data.previous || null,
              });
              setDelistedError(null);
            } else {
              setDelistedError(delistedResult.error || "Failed to load delisted listings");
            }
            break;
          case "sold":
            const soldResult = await getStoreSoldListings(soldPage);
            if (soldResult.success && soldResult.data) {
              const sorted = [...soldResult.data.results].sort((a, b) => {
                if (a.tag_removed !== b.tag_removed) {
                  return a.tag_removed ? 1 : -1;
                }
                const at = new Date(a.sold_at).getTime();
                const bt = new Date(b.sold_at).getTime();
                return bt - at;
              });
              setSoldListings(sorted);
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
  }, [activeTab, activePage, recalledPage, delistedPage, soldPage]);

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

  const handleDelistedPreviousPage = () => {
    if (delistedPagination.previous) {
      setDelistedPage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleDelistedNextPage = () => {
    if (delistedPagination.next) {
      setDelistedPage((prev) => {
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
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-normal leading-8 min-w-0">Listings</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const nextTab = value as "active" | "recalled" | "sold" | "delisted";
          setActiveTab(nextTab);
          router.replace(`${Routes.STORE.LISTINGS.ROOT}?tab=${nextTab}`, { scroll: false });
        }}
        className="w-full"
      >
        <TabsList variant="pill">
          <TabsTrigger variant="secondary" value="active">
            <span>Active</span>
            {pastMinListingDaysCount > 0 && (
              <Badge
                variant="secondary-inverse"
                className="pointer-events-none h-4 min-w-4 px-1 flex items-center justify-center text-[10px] sm:h-5 sm:min-w-5 sm:px-1.5 sm:text-xs"
              >
                {pastMinListingDaysCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="recalled">
            <span>Recalled</span>
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="sold">
            <span>Sold</span>
            {soldTagAttachedCount > 0 && (
              <Badge
                variant="destructive"
                className="pointer-events-none h-4 min-w-4 px-1 flex items-center justify-center text-[10px] sm:h-5 sm:min-w-5 sm:px-1.5 sm:text-xs"
              >
                {soldTagAttachedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="delisted">
            <span>Delisted</span>
            {delistedNeedsTagRemovedCount > 0 && (
              <Badge
                variant="destructive"
                className="pointer-events-none h-4 min-w-4 px-1 flex items-center justify-center text-[10px] sm:h-5 sm:min-w-5 sm:px-1.5 sm:text-xs"
              >
                {delistedNeedsTagRemovedCount}
              </Badge>
            )}
          </TabsTrigger>
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

        <TabsContent value="delisted" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : delistedError ? (
            <div className="text-destructive">{delistedError}</div>
          ) : delistedListings.length === 0 ? (
            <div className="text-muted-foreground">No delisted listings</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {delistedListings.map((listing) => (
                  <DelistedListingCard key={`${listing.status}-${listing.id}`} listing={listing} />
                ))}
              </div>
              {delistedPagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {delistedListings.length} of {delistedPagination.count}{" "}
                    {delistedPagination.count === 1 ? "listing" : "listings"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelistedPreviousPage}
                      disabled={!delistedPagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {delistedPage} of {delistedPagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelistedNextPage}
                      disabled={!delistedPagination.next || loading}
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
