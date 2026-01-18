"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@src/components/ui/tabs";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@src/components/ui/alert";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import { getMemberItems, Item, ITEM_STATUS } from "@src/api/itemsApi";
import ItemCard from "@src/app/member/items/components/ItemCard";

export default function MemberItemsPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.MEMBER}>
      <MemberItemsContent />
    </AuthenticatedPage>
  );
}

function MemberItemsContent() {
  const [activeTab, setActiveTab] = useState("in-store");
  const [loading, setLoading] = useState(true);

  // Page state for each tab
  const [inStorePage, setInStorePage] = useState(1);
  const [atHomePage, setAtHomePage] = useState(1);
  const [soldPage, setSoldPage] = useState(1);

  // State for each tab's items
  const [inStoreItems, setInStoreItems] = useState<Item[]>([]);
  const [atHomeItems, setAtHomeItems] = useState<Item[]>([]);
  const [soldItems, setSoldItems] = useState<Item[]>([]);

  // Pagination metadata for each tab
  const [inStorePagination, setInStorePagination] = useState<{
    count: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
  }>({ count: 0, total_pages: 1, next: null, previous: null });
  const [atHomePagination, setAtHomePagination] = useState<{
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
  const [inStoreError, setInStoreError] = useState<string | null>(null);
  const [atHomeError, setAtHomeError] = useState<string | null>(null);
  const [soldError, setSoldError] = useState<string | null>(null);

  // Calculate recalled count for notification badge
  const recalledCount = useMemo(() => {
    return inStoreItems.filter(
      (item) => item.status === ITEM_STATUS.RECALLED
    ).length;
  }, [inStoreItems]);

  // Preload in-store items on mount to get recalled count for badge
  useEffect(() => {
    const loadInStoreItems = async () => {
      try {
        const inStoreResult = await getMemberItems({
          status: [ITEM_STATUS.LISTED, ITEM_STATUS.RECALLED],
          sort_by: "-status",
          page: 1,
        });
        if (inStoreResult.success && inStoreResult.data) {
          setInStoreItems(inStoreResult.data.results);
          setInStorePagination({
            count: inStoreResult.data.count || 0,
            total_pages: inStoreResult.data.total_pages || 1,
            next: inStoreResult.data.next || null,
            previous: inStoreResult.data.previous || null,
          });
          setInStoreError(null);
        } else {
          setInStoreError(
            inStoreResult.error || "Failed to load in-store items"
          );
        }
      } catch (error) {
        console.error("Error loading in-store items:", error);
      }
    };

    loadInStoreItems();
  }, []);

  // Reset page when tab changes
  useEffect(() => {
    setInStorePage(1);
    setAtHomePage(1);
    setSoldPage(1);
  }, [activeTab]);

  // Load data when tab or page changes
  useEffect(() => {
    const loadTabData = async () => {
      setLoading(true);

      try {
        switch (activeTab) {
          case "in-store":
            const inStoreResult = await getMemberItems({
              status: [ITEM_STATUS.LISTED, ITEM_STATUS.RECALLED],
              sort_by: "-status",
              page: inStorePage,
            });
            if (inStoreResult.success && inStoreResult.data) {
              setInStoreItems(inStoreResult.data.results);
              setInStorePagination({
                count: inStoreResult.data.count || 0,
                total_pages: inStoreResult.data.total_pages || 1,
                next: inStoreResult.data.next || null,
                previous: inStoreResult.data.previous || null,
              });
              setInStoreError(null);
            } else {
              setInStoreError(
                inStoreResult.error || "Failed to load in-store items"
              );
            }
            break;
          case "at-home":
            const atHomeResult = await getMemberItems({
              status: ITEM_STATUS.AVAILABLE,
              page: atHomePage,
            });
            if (atHomeResult.success && atHomeResult.data) {
              setAtHomeItems(atHomeResult.data.results);
              setAtHomePagination({
                count: atHomeResult.data.count || 0,
                total_pages: atHomeResult.data.total_pages || 1,
                next: atHomeResult.data.next || null,
                previous: atHomeResult.data.previous || null,
              });
              setAtHomeError(null);
            } else {
              setAtHomeError(
                atHomeResult.error || "Failed to load wardrobe items"
              );
            }
            break;
          case "sold":
            const soldResult = await getMemberItems({
              status: ITEM_STATUS.SOLD,
              page: soldPage,
            });
            if (soldResult.success && soldResult.data) {
              setSoldItems(soldResult.data.results);
              setSoldPagination({
                count: soldResult.data.count || 0,
                total_pages: soldResult.data.total_pages || 1,
                next: soldResult.data.next || null,
                previous: soldResult.data.previous || null,
              });
              setSoldError(null);
            } else {
              setSoldError(soldResult.error || "Failed to load sold items");
            }
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} items:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab, inStorePage, atHomePage, soldPage]);

  // Pagination handlers
  const handleInStorePreviousPage = () => {
    if (inStorePagination.previous) {
      setInStorePage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleInStoreNextPage = () => {
    if (inStorePagination.next) {
      setInStorePage((prev) => {
        const newPage = prev + 1;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleAtHomePreviousPage = () => {
    if (atHomePagination.previous) {
      setAtHomePage((prev) => {
        const newPage = Math.max(1, prev - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return newPage;
      });
    }
  };

  const handleAtHomeNextPage = () => {
    if (atHomePagination.next) {
      setAtHomePage((prev) => {
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
      <h1 className="text-3xl font-normal mb-4">My Items</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="in-store" className="relative inline-flex items-center gap-2">
            <span>In Store</span>
            {recalledCount > 0 && (
              <Badge
                variant="destructive"
                className="h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
              >
                {recalledCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="at-home">My Wardrobe</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>

        <TabsContent value="in-store" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : inStoreError ? (
            <div className="text-destructive">{inStoreError}</div>
          ) : inStoreItems.length === 0 ? (
            <div className="text-muted-foreground">No listed items.</div>
          ) : (
            <>
              {recalledCount > 0 && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>You have recalled items</AlertTitle>
                  <AlertDescription>
                    Please collect your recalled items before their collection deadline.
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {inStoreItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              {inStorePagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {inStoreItems.length} of {inStorePagination.count}{" "}
                    {inStorePagination.count === 1 ? "item" : "items"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleInStorePreviousPage}
                      disabled={!inStorePagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {inStorePage} of {inStorePagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleInStoreNextPage}
                      disabled={!inStorePagination.next || loading}
                    >
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="at-home" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <Link href={Routes.STORES.ROOT}>
              <Button size="sm" className="lg:text-base lg:px-4 lg:py-2">
                Find a Store
              </Button>
            </Link>
            <Link href={Routes.MEMBER.ITEMS.NEW}>
              <Button size="sm" variant="outline" className="lg:text-base lg:px-4 lg:py-2">
                New Item
              </Button>
            </Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : atHomeError ? (
            <div className="text-destructive">{atHomeError}</div>
          ) : atHomeItems.length === 0 ? (
            <div className="text-muted-foreground">No items in your wardrobe.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {atHomeItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              {atHomePagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {atHomeItems.length} of {atHomePagination.count}{" "}
                    {atHomePagination.count === 1 ? "item" : "items"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAtHomePreviousPage}
                      disabled={!atHomePagination.previous || loading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                    <div className="text-sm text-muted-foreground px-2">
                      Page {atHomePage} of {atHomePagination.total_pages || 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAtHomeNextPage}
                      disabled={!atHomePagination.next || loading}
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
          ) : soldItems.length === 0 ? (
            <div className="text-muted-foreground">No sold items.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {soldItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              {soldPagination.count > 0 && (
                <div className="mt-8 flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {soldItems.length} of {soldPagination.count}{" "}
                    {soldPagination.count === 1 ? "item" : "items"}
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
      </Tabs>
    </div>
  );
}
