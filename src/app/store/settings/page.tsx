"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Checkbox } from "@src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { itemCategories, itemConditions } from "@src/data/itemReferenceData";
import { useToast } from "@src/hooks/use-toast";
import type { PaginatedResponse } from "@src/types/api";
import { generateNewStorePin } from "@src/api/storeApi";
import { formatCurrency } from "@src/lib/formatters";

interface StoreProfile {
  store_name: string;
  commission: number;
  stock_limit: number;
  min_listing_days: number;
  min_price: number | string;
  active_listings_count: number;
  tags_available: number;
  currency?: string;
  created_at: string;
  updated_at: string;
}

type StoreCategoryResponse = Array<{ id: number; category: { id: number } }>;
type StoreConditionResponse = Array<{ id: number; condition: { id: number } }>;
type PaginatedOrArray<T> = PaginatedResponse<T> | T[];

export default function StoreSettingsPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreSettingsContent />
    </AuthenticatedPage>
  );
}

function StoreSettingsContent() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [commission, setCommission] = useState<string>("");
  const [stockLimit, setStockLimit] = useState<string>("");
  const [minListingDays, setMinListingDays] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedConditionIds, setSelectedConditionIds] = useState<number[]>([]);

  const [isSavingRules, setIsSavingRules] = useState(false);
  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const [isSavingConditions, setIsSavingConditions] = useState(false);

  const [initialRules, setInitialRules] = useState<{
    commission: number;
    stock_limit: number;
    min_listing_days: number;
    min_price: number;
  } | null>(null);
  const [initialCategoryIds, setInitialCategoryIds] = useState<number[] | null>(null);
  const [initialConditionIds, setInitialConditionIds] = useState<number[] | null>(null);

  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinDialogValue, setPinDialogValue] = useState("");
  const [pinDialogError, setPinDialogError] = useState<string | null>(null);
  const [isSubmittingWithPin, setIsSubmittingWithPin] = useState(false);
  const [pendingSave, setPendingSave] = useState<
    | { kind: "rules" }
    | { kind: "categories" }
    | { kind: "conditions" }
    | null
  >(null);

  const [requestPinDialogOpen, setRequestPinDialogOpen] = useState(false);
  const [requestPinIsSubmitting, setRequestPinIsSubmitting] = useState(false);
  const [requestPinSent, setRequestPinSent] = useState(false);
  const [requestPinError, setRequestPinError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const getResults = <T,>(data: PaginatedOrArray<T>): T[] => {
      if (Array.isArray(data)) return data;
      return data?.results ?? [];
    };

    const run = async () => {
      try {
        setError(null);
        const [profileRes, categoriesRes, conditionsRes] = await Promise.all([
          fetchClient({
            method: "GET",
            url: API_ROUTES.STORES.PROFILE,
          }),
          fetchClient({
            method: "GET",
            url: API_ROUTES.STORES.CATEGORIES,
          }),
          fetchClient({
            method: "GET",
            url: API_ROUTES.STORES.CONDITIONS,
          }),
        ]);

        const profile = profileRes.data as StoreProfile;
        setStoreProfile(profile);
        syncFormFromProfile(profile);
        setInitialRules({
          commission: Number(profile.commission),
          stock_limit: Number(profile.stock_limit),
          min_listing_days: Number(profile.min_listing_days),
          min_price: Number(profile.min_price),
        });

        const storeCategories = getResults(
          categoriesRes.data as PaginatedOrArray<StoreCategoryResponse[number]>
        );
        const loadedCategoryIds = storeCategories
          .map((row) => row?.category?.id)
          .filter((id): id is number => typeof id === "number");
        setSelectedCategoryIds(
          storeCategories
            .map((row) => row?.category?.id)
            .filter((id): id is number => typeof id === "number")
        );
        setInitialCategoryIds(loadedCategoryIds);

        const storeConditions = getResults(
          conditionsRes.data as PaginatedOrArray<StoreConditionResponse[number]>
        );
        const loadedConditionIds = storeConditions
          .map((row) => row?.condition?.id)
          .filter((id): id is number => typeof id === "number");
        setSelectedConditionIds(
          storeConditions
            .map((row) => row?.condition?.id)
            .filter((id): id is number => typeof id === "number")
        );
        setInitialConditionIds(loadedConditionIds);
      } catch (err) {
        console.error("Failed to load store settings:", err);
        setError("Failed to load store settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const syncFormFromProfile = (profile: StoreProfile) => {
    setCommission(String(profile.commission ?? ""));
    setStockLimit(String(profile.stock_limit ?? ""));
    setMinListingDays(String(profile.min_listing_days ?? ""));
    setMinPrice(String(profile.min_price ?? ""));
  };

  const normalizeIdList = (ids: number[]) => {
    return Array.from(new Set(ids)).sort((a, b) => a - b);
  };

  const normalizeNumber = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return n;
  };

  const normalizeMoney = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100) / 100;
  };

  const rulesDirty = useMemo(() => {
    if (!initialRules) return false;

    const current = {
      commission: normalizeNumber(commission),
      stock_limit: normalizeNumber(stockLimit),
      min_listing_days: normalizeNumber(minListingDays),
      min_price: normalizeMoney(minPrice),
    };

    if (
      current.commission === null ||
      current.stock_limit === null ||
      current.min_listing_days === null ||
      current.min_price === null
    ) {
      return true;
    }

    return (
      current.commission !== initialRules.commission ||
      current.stock_limit !== initialRules.stock_limit ||
      current.min_listing_days !== initialRules.min_listing_days ||
      current.min_price !== initialRules.min_price
    );
  }, [commission, stockLimit, minListingDays, minPrice, initialRules]);

  const categoriesDirty = useMemo(() => {
    if (!initialCategoryIds) return false;
    const a = normalizeIdList(initialCategoryIds);
    const b = normalizeIdList(selectedCategoryIds);
    if (a.length !== b.length) return true;
    return a.some((v, i) => v !== b[i]);
  }, [initialCategoryIds, selectedCategoryIds]);

  const conditionsDirty = useMemo(() => {
    if (!initialConditionIds) return false;
    const a = normalizeIdList(initialConditionIds);
    const b = normalizeIdList(selectedConditionIds);
    if (a.length !== b.length) return true;
    return a.some((v, i) => v !== b[i]);
  }, [initialConditionIds, selectedConditionIds]);

  const openPinDialog = (next: NonNullable<typeof pendingSave>) => {
    setPendingSave(next);
    setPinDialogError(null);
    setPinDialogValue("");
    setPinDialogOpen(true);
  };

  const closePinDialog = () => {
    setPinDialogOpen(false);
    setPinDialogError(null);
    setPinDialogValue("");
    setPendingSave(null);
  };

  const openRequestPinDialog = () => {
    setRequestPinSent(false);
    setRequestPinError(null);
    setRequestPinDialogOpen(true);
    setPinDialogOpen(false);
  };

  const toggleId = (
    ids: number[],
    id: number,
    setIds: (next: number[]) => void
  ) => {
    if (ids.includes(id)) setIds(ids.filter((x) => x !== id));
    else setIds([...ids, id]);
  };

  const handleSaveRules = async () => {
    const commissionNum = Number(commission);
    const stockLimitNum = Number(stockLimit);
    const minListingDaysNum = Number(minListingDays);
    const minPriceNum = Number(minPrice);

    if (!Number.isFinite(commissionNum) || commissionNum < 0 || commissionNum > 50) {
      toast({ title: "Commission must be between 0 and 50", variant: "destructive" });
      return;
    }
    if (!Number.isFinite(stockLimitNum) || stockLimitNum < 1) {
      toast({ title: "Stock limit must be at least 1", variant: "destructive" });
      return;
    }
    if (!Number.isFinite(minListingDaysNum) || minListingDaysNum < 7) {
      toast({ title: "Minimum listing days must be at least 7", variant: "destructive" });
      return;
    }
    if (!Number.isFinite(minPriceNum) || minPriceNum < 0) {
      toast({ title: "Minimum price must be 0 or more", variant: "destructive" });
      return;
    }

    openPinDialog({ kind: "rules" });
  };

  const handleSaveCategories = async () => {
    openPinDialog({ kind: "categories" });
  };

  const handleSaveConditions = async () => {
    openPinDialog({ kind: "conditions" });
  };

  const submitWithPin = async () => {
    const pin = pinDialogValue.trim();
    if (pin.length !== 4) {
      setPinDialogError("PIN must be 4 digits.");
      return;
    }
    if (!pendingSave) return;

    setPinDialogError(null);
    setIsSubmittingWithPin(true);

    try {
      if (pendingSave.kind === "rules") {
        const commissionNum = Number(commission);
        const stockLimitNum = Number(stockLimit);
        const minListingDaysNum = Number(minListingDays);
        const minPriceNum = Number(minPrice);

        setIsSavingRules(true);
        const res = await fetchClient({
          method: "PATCH",
          url: API_ROUTES.STORES.PROFILE,
          data: {
            pin,
            commission: commissionNum,
            stock_limit: stockLimitNum,
            min_listing_days: minListingDaysNum,
            min_price: minPriceNum,
          },
        });
        const profile = res.data as StoreProfile;
        setStoreProfile(profile);
        syncFormFromProfile(profile);
        setInitialRules({
          commission: Number(profile.commission),
          stock_limit: Number(profile.stock_limit),
          min_listing_days: Number(profile.min_listing_days),
          min_price: Number(profile.min_price),
        });
        toast({ title: "Settings updated" });
      }

      if (pendingSave.kind === "categories") {
        setIsSavingCategories(true);
        await fetchClient({
          method: "POST",
          url: API_ROUTES.STORES.CATEGORIES,
          data: { pin, categories: selectedCategoryIds },
        });
        setInitialCategoryIds(selectedCategoryIds);
        toast({ title: "Categories updated" });
      }

      if (pendingSave.kind === "conditions") {
        setIsSavingConditions(true);
        await fetchClient({
          method: "POST",
          url: API_ROUTES.STORES.CONDITIONS,
          data: { pin, conditions: selectedConditionIds },
        });
        setInitialConditionIds(selectedConditionIds);
        toast({ title: "Conditions updated" });
      }

      setPinDialogOpen(false);
      setPendingSave(null);
      setPinDialogValue("");
    } catch (err: unknown) {
      const detail =
        typeof err === "object" && err && "response" in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).response?.data?.detail
          : null;

      const detailText =
        typeof detail === "string" ? detail : detail && typeof detail === "object" ? null : null;

      if (detailText === "PIN is required." || detailText === "Invalid PIN.") {
        setPinDialogError(detailText);
        return;
      }

      console.error("Failed to save with PIN:", err);
      toast({ title: "Failed to save changes", variant: "destructive" });
    } finally {
      setIsSavingRules(false);
      setIsSavingCategories(false);
      setIsSavingConditions(false);
      setIsSubmittingWithPin(false);
    }
  };

  const submitRequestNewPin = async () => {
    try {
      setRequestPinIsSubmitting(true);
      setRequestPinError(null);
      const res = await generateNewStorePin();
      if (res.success) {
        setRequestPinSent(true);
        return;
      }
      setRequestPinError(res.error ?? "Please try again.");
    } finally {
      setRequestPinIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading store settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-normal leading-8">Hosting rules</h1>
        </div>
      </div>

      {storeProfile && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{storeProfile.store_name} rules:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {commission.trim() ? `${commission.trim()}%` : "—"}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Minimum price</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {minPrice.trim() && Number.isFinite(Number(minPrice)) ? formatCurrency(Number(minPrice)) : "—"}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Max items accepted</p>
                  <p className="text-2xl font-bold tabular-nums">{stockLimit.trim() ? stockLimit.trim() : "—"}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Guaranteed display period</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {minListingDays.trim()
                      ? `${minListingDays.trim()} ${Number(minListingDays) === 1 ? "day" : "days"}`
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update hosting rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min={0}
                    max={50}
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-price">Minimum price</Label>
                  <Input
                    id="min-price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-limit">Max items accepted</Label>
                  <Input
                    id="stock-limit"
                    type="number"
                    min={1}
                    value={stockLimit}
                    onChange={(e) => setStockLimit(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-days">Guaranteed display period (days)</Label>
                  <Input
                    id="min-days"
                    type="number"
                    min={7}
                    value={minListingDays}
                    onChange={(e) => setMinListingDays(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveRules}
                  disabled={!rulesDirty || isSavingRules || isSubmittingWithPin}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accepted categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {itemCategories.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      checked={selectedCategoryIds.includes(c.id)}
                      onCheckedChange={() =>
                        toggleId(selectedCategoryIds, c.id, setSelectedCategoryIds)
                      }
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveCategories}
                  disabled={!categoriesDirty || isSavingCategories || isSubmittingWithPin}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accepted conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {itemConditions.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      checked={selectedConditionIds.includes(c.id)}
                      onCheckedChange={() =>
                        toggleId(selectedConditionIds, c.id, setSelectedConditionIds)
                      }
                    />
                    <span>{c.condition}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveConditions}
                  disabled={!conditionsDirty || isSavingConditions || isSubmittingWithPin}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog
        open={pinDialogOpen}
        onOpenChange={(open) => {
          if (!open) closePinDialog();
          else setPinDialogOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PIN to save</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="pin">Store PIN</Label>
            <Input
              id="pin"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="4-digit PIN"
              value={pinDialogValue}
              onChange={(e) => setPinDialogValue(e.target.value)}
            />
            {pinDialogError && (
              <p className="text-sm text-destructive">{pinDialogError}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Forgot PIN?{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 align-baseline"
                onClick={openRequestPinDialog}
                disabled={isSubmittingWithPin}
              >
                Request a new PIN
              </Button>
            </p>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closePinDialog}
              disabled={isSubmittingWithPin}
            >
              Cancel
            </Button>
            <Button type="button" onClick={submitWithPin} disabled={isSubmittingWithPin}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={requestPinDialogOpen}
        onOpenChange={(open) => {
          setRequestPinDialogOpen(open);
          if (!open && pendingSave) setPinDialogOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a new PIN</DialogTitle>
          </DialogHeader>

          {!requestPinSent ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We&apos;ll generate a new store PIN and email it to you. Your existing PIN will no
                longer work.
              </p>
              {requestPinError && (
                <p className="text-sm text-destructive">{requestPinError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                New PIN sent. Please check your email.
              </p>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            {!requestPinSent ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRequestPinDialogOpen(false);
                    setPinDialogOpen(true);
                  }}
                  disabled={requestPinIsSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={submitRequestNewPin}
                  disabled={requestPinIsSubmitting}
                >
                  Request new PIN
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setRequestPinDialogOpen(false);
                  setPinDialogOpen(true);
                }}
              >
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
