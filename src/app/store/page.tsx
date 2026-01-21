"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import { UserRoles } from "@src/types/roles";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { Button } from "@src/components/ui/button";
import { Badge } from "@src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@src/components/ui/tabs";
import { ChevronRight, Clock, Settings, Shirt, Store, Tag, User } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@src/components/ui/chart";
import { formatCurrency } from "@src/lib/formatters";
import { parseApiDate } from "@src/lib/utils";
import { Routes } from "@src/constants/routes";
import { getStoreProfile } from "@src/api/storeApi";
import {
  getStoreCategoryBreakdownAnalytics,
  getStoreDelistedListings,
  getStoreListings,
  getStoreRecalledListings,
  getStoreSalesAnalytics,
  getStoreSoldListings,
  type StoreAnalyticsPeriod,
  type StoreCategoryBreakdownRow,
  type StoreSalesAnalyticsPoint,
} from "@src/api/listingsApi";
import { RecentActivityTable } from "@src/app/store/components/RecentActivityTable";

export default function StoreDashboardPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreDashboardContent />
    </AuthenticatedPage>
  );
}

function StoreDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const [activeListingsCount, setActiveListingsCount] = useState<number | null>(null);
  const [stockLimit, setStockLimit] = useState<number | null>(null);
  const [recalledCount, setRecalledCount] = useState<number | null>(null);

  const [soldTagAttachedCount, setSoldTagAttachedCount] = useState<number | null>(null);
  const [delistedNeedsTagRemovedCount, setDelistedNeedsTagRemovedCount] = useState<number | null>(
    null
  );
  const [availableForRecallCount, setAvailableForRecallCount] = useState<number | null>(null);

  const [salesPeriod, setSalesPeriod] = useState<StoreAnalyticsPeriod>("7d");
  const [salesMetric, setSalesMetric] = useState<"value" | "amount">("value");
  const [salesSeries, setSalesSeries] = useState<StoreSalesAnalyticsPoint[]>([]);

  const [categoryPeriod, setCategoryPeriod] = useState<StoreAnalyticsPeriod>("7d");
  const [categoryMetric, setCategoryMetric] = useState<"value" | "amount">("value");
  const [categoryBreakdown, setCategoryBreakdown] = useState<StoreCategoryBreakdownRow[]>([]);

  const salesTotals = useMemo(() => {
    const totalSales = salesSeries.reduce((acc, p) => acc + (p.sales_count ?? 0), 0);
    const totalCommission = salesSeries.reduce(
      (acc, p) => acc + (Number(p.commission_total) || 0),
      0
    );
    const totalSaleValue = salesSeries.reduce((acc, p) => acc + (Number(p.sale_total) || 0), 0);
    return { totalSales, totalCommission, totalSaleValue };
  }, [salesSeries]);

  const availableSpaces = useMemo(() => {
    if (activeListingsCount === null || stockLimit === null) return null;
    return Math.max(stockLimit - activeListingsCount, 0);
  }, [activeListingsCount, stockLimit]);

  const salesChartConfig = useMemo(() => {
    return {
      sales_count: {
        label: "Sales",
        // teal, consistent with platform palette
        color: "hsl(var(--chart-2))",
      },
      commission_total: {
        label: "Commission",
        // same teal; we only show one metric at a time anyway
        color: "hsl(var(--chart-2))",
      },
    } satisfies ChartConfig;
  }, []);

  const formatAxisCurrency0 = useMemo(() => {
    const fmt = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    });
    return (value: number) => fmt.format(value);
  }, []);

  const formatAxisCurrency0Compact = useMemo(() => {
    const fmt = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
      notation: "compact",
    });
    return (value: number) => fmt.format(value);
  }, []);

  const formatAxisDate = (dateString: string) => {
    const d = parseApiDate(dateString);
    if (!d) return dateString;

    if (salesPeriod === "7d") {
      return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d);
    }

    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(d);
  };

  const salesChartData = useMemo(() => {
    return salesSeries.map((p) => {
      return {
        date: p.date,
        sales_count: p.sales_count,
        commission_total: Number(p.commission_total) || 0,
        sale_total: Number(p.sale_total) || 0,
      };
    });
  }, [salesSeries]);

  const categoryChartConfig = useMemo(() => {
    return {
      amount: { label: "Items sold", color: "hsl(var(--chart-2))" },
      value: { label: "Commission", color: "hsl(var(--chart-2))" },
    } satisfies ChartConfig;
  }, []);

  const categoryChartData = useMemo(() => {
    const rows = categoryBreakdown.slice(0, 8);
    return rows.map((r) => ({
      category_name: r.category_name,
      amount: r.sales_count,
      value: Number(r.commission_total) || 0,
    }));
  }, [categoryBreakdown]);

  const formatCategoryLabel = (value: string) => {
    const v = value ?? "";
    const max = 12;
    return v.length > max ? `${v.slice(0, max)}…` : v;
  };

  useEffect(() => {
    const loadAtAGlanceAndNeedsAttention = async () => {
      setLoading(true);
      setError(null);

      try {
        const [profileRes, recalledRes] = await Promise.all([
          getStoreProfile(),
          getStoreRecalledListings(1),
        ]);

        if (!profileRes.success || !profileRes.data) {
          setError(profileRes.error ?? "Failed to load store profile");
          return;
        }

        setStoreName(profileRes.data.store_name);
        setProfilePhotoUrl(profileRes.data.profile_photo_url || null);
        setActiveListingsCount(profileRes.data.active_listings_count);
        setStockLimit(profileRes.data.stock_limit);

        if (recalledRes.success && recalledRes.data) {
          setRecalledCount(recalledRes.data.count);
        } else {
          setRecalledCount(0);
        }

        const countAcrossPages = async <T,>(
          fetchPage: (page: number) => Promise<{
            success: boolean;
            data?: { results: T[]; total_pages?: number };
            error?: string;
          }>,
          predicate: (row: T) => boolean
        ) => {
          let page = 1;
          let totalPages = 1;
          let count = 0;

          while (page <= totalPages) {
            const res = await fetchPage(page);
            if (!res.success || !res.data) break;

            totalPages = res.data.total_pages || 1;
            count += res.data.results.filter(predicate).length;
            page += 1;
          }

          return count;
        };

        const [soldAttached, delistedNeedsTagRemoved, availableForRecall] = await Promise.all([
          countAcrossPages(
            (page) => getStoreSoldListings(page),
            (row) => (row as { tag_removed?: boolean }).tag_removed === false
          ),
          countAcrossPages(
            (page) => getStoreDelistedListings(page),
            (row) => (row as { needs_tag_removed?: boolean }).needs_tag_removed === true
          ),
          countAcrossPages(
            (page) => getStoreListings(page),
            (row) => (row as { past_min_listing_days?: boolean }).past_min_listing_days === true
          ),
        ]);

        setSoldTagAttachedCount(soldAttached);
        setDelistedNeedsTagRemovedCount(delistedNeedsTagRemoved);
        setAvailableForRecallCount(availableForRecall);
      } catch (e) {
        console.error("Error loading store dashboard:", e);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadAtAGlanceAndNeedsAttention();
  }, []);

  useEffect(() => {
    const loadSales = async () => {
      const res = await getStoreSalesAnalytics(salesPeriod);
      if (res.success && res.data) {
        setSalesSeries(res.data.series);
        return;
      }
      setSalesSeries([]);
    };
    loadSales();
  }, [salesPeriod]);

  useEffect(() => {
    const loadCategory = async () => {
      const res = await getStoreCategoryBreakdownAnalytics(categoryPeriod);
      if (res.success && res.data) {
        setCategoryBreakdown(res.data.category_breakdown);
        return;
      }
      setCategoryBreakdown([]);
    };
    loadCategory();
  }, [categoryPeriod]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('blob:')) return imageUrl;
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_t=${Date.now()}`;
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4">
        <div className="flex items-end gap-4">
          <div className="relative shrink-0">
            {loading ? (
              <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full bg-muted animate-pulse" />
            ) : profilePhotoUrl ? (
              <div className="relative h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden bg-muted">
                <Image
                  src={getImageUrl(profilePhotoUrl)}
                  alt={storeName || "Store"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full bg-muted flex items-center justify-center">
                <Store className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 text-muted-foreground" />
              </div>
            )}
          </div>
          {storeName && (
            <div className="flex items-end pb-2">
              <span className="text-3xl font-normal leading-8">
                {storeName}
              </span>
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-row flex-wrap items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto justify-between">
            <Link
              href={Routes.STORE.LISTINGS.ROOT}
              className="flex w-full items-center gap-3"
            >
              <span className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                <span>Listings</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto justify-between">
            <Link
              href={Routes.STORE.PROFILE}
              className="flex w-full items-center gap-3"
            >
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto justify-between">
            <Link
              href={Routes.STORE.SETTINGS}
              className="flex w-full items-center gap-3"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Hosting rules</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="sr-only">At a glance</h2>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Items listed</span>
                </div>
                <span className="font-bold text-xl md:text-2xl text-primary">
                  {activeListingsCount ?? "—"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Spaces available</span>
                </div>
                <span className="font-bold text-xl md:text-2xl text-foreground">
                  {availableSpaces ?? "—"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Awaiting collection</span>
                </div>
                <span className="font-bold text-xl md:text-2xl">
                  {recalledCount ?? "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <span className="font-medium">Sold tags to remove</span>
              </div>
              <div className="flex items-center gap-2">
                {soldTagAttachedCount === null ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : soldTagAttachedCount > 0 ? (
                  <Badge
                    variant="destructive"
                    className="pointer-events-none h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
                  >
                    {soldTagAttachedCount}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">0</span>
                )}
                {soldTagAttachedCount !== null && soldTagAttachedCount > 0 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${Routes.STORE.LISTINGS.ROOT}?tab=sold`}>View</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    View
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <span className="font-medium">Abandoned listings</span>
              </div>
              <div className="flex items-center gap-2">
                {delistedNeedsTagRemovedCount === null ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : delistedNeedsTagRemovedCount > 0 ? (
                  <Badge
                    variant="destructive"
                    className="pointer-events-none h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
                  >
                    {delistedNeedsTagRemovedCount}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">0</span>
                )}
                {delistedNeedsTagRemovedCount !== null && delistedNeedsTagRemovedCount > 0 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${Routes.STORE.LISTINGS.ROOT}?tab=delisted`}>View</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    View
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <span className="font-medium">Past display period guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                {availableForRecallCount === null ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : availableForRecallCount > 0 ? (
                  <Badge
                    variant="secondary-inverse"
                    className="pointer-events-none h-5 min-w-5 px-1.5 flex items-center justify-center text-xs"
                  >
                    {availableForRecallCount}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">0</span>
                )}
                {availableForRecallCount !== null && availableForRecallCount > 0 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${Routes.STORE.LISTINGS.ROOT}?tab=active`}>View</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    View
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
              <Tabs value={salesPeriod} onValueChange={(v) => setSalesPeriod(v as StoreAnalyticsPeriod)}>
                <TabsList variant="pill" className="w-auto">
                  <TabsTrigger variant="secondary" value="7d">
                    Week
                  </TabsTrigger>
                  <TabsTrigger variant="secondary" value="30d">
                    Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={salesMetric} onValueChange={(v) => setSalesMetric(v as "value" | "amount")}>
                <TabsList variant="pill" className="w-auto">
                  <TabsTrigger variant="secondary" value="value">
                    Value
                  </TabsTrigger>
                  <TabsTrigger variant="secondary" value="amount">
                    Amount
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total sales</p>
                <p className="text-lg sm:text-2xl font-bold tabular-nums break-words">
                  {formatCurrency(salesTotals.totalSaleValue)}
                </p>
              </div>
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Items sold</p>
                <p className="text-lg sm:text-2xl font-bold tabular-nums break-words">
                  {salesTotals.totalSales}
                </p>
              </div>
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-lg sm:text-2xl font-bold tabular-nums break-words">
                  {formatCurrency(salesTotals.totalCommission)}
                </p>
              </div>
            </div>

            <ChartContainer
              config={salesChartConfig}
              className="h-[240px] w-full max-w-full aspect-auto"
            >
              <BarChart
                accessibilityLayer
                data={salesChartData}
                margin={{ left: 0, right: 8, top: 8, bottom: 8 }}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(v) => formatAxisDate(String(v))}
                  minTickGap={28}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={salesMetric === "value" ? 52 : 28}
                  tickFormatter={(v) => {
                    const n = Number(v) || 0;
                    if (salesMetric === "value") {
                      // Keep labels short enough to avoid overflow, without needing JS media queries.
                      return Math.abs(n) >= 10000
                        ? formatAxisCurrency0Compact(n)
                        : formatAxisCurrency0(n);
                    }
                    return n.toString();
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      formatter={(value, name) => {
                        if (name === "commission_total" || name === "sale_total") {
                          return formatCurrency(Number(value) || 0)
                        }
                        return (Number(value) || 0).toLocaleString()
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={salesMetric === "value" ? "commission_total" : "sales_count"}
                  fill={
                    salesMetric === "value"
                      ? "var(--color-commission_total)"
                      : "var(--color-sales_count)"
                  }
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
              <Tabs
                value={categoryPeriod}
                onValueChange={(v) => setCategoryPeriod(v as StoreAnalyticsPeriod)}
              >
                <TabsList variant="pill" className="w-auto">
                  <TabsTrigger variant="secondary" value="7d">
                    Week
                  </TabsTrigger>
                  <TabsTrigger variant="secondary" value="30d">
                    Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs value={categoryMetric} onValueChange={(v) => setCategoryMetric(v as "value" | "amount")}>
                <TabsList variant="pill" className="w-auto">
                  <TabsTrigger variant="secondary" value="value">
                    Value
                  </TabsTrigger>
                  <TabsTrigger variant="secondary" value="amount">
                    Amount
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ChartContainer
              config={categoryChartConfig}
              className="h-[320px] w-full max-w-full aspect-auto"
            >
              <BarChart
                accessibilityLayer
                data={categoryChartData}
                layout="vertical"
                margin={{ left: 0, right: 16, top: 8, bottom: 8 }}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  allowDecimals={false}
                  tickFormatter={(v) =>
                    categoryMetric === "value"
                      ? (Math.abs(Number(v) || 0) >= 10000
                        ? formatAxisCurrency0Compact(Number(v))
                        : formatAxisCurrency0(Number(v)))
                      : (Number(v) || 0).toLocaleString()
                  }
                />
                <YAxis
                  type="category"
                  dataKey="category_name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={100}
                  tickFormatter={(v) => formatCategoryLabel(String(v))}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      formatter={(value) =>
                        categoryMetric === "value"
                          ? formatCurrency(Number(value) || 0)
                          : (Number(value) || 0).toLocaleString()
                      }
                    />
                  }
                />
                <Bar
                  dataKey={categoryMetric}
                  fill={categoryMetric === "value" ? "var(--color-value)" : "var(--color-amount)"}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RecentActivityTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
