"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@src/components/ui/tabs";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@src/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { ChevronLeft, ChevronRight, AlertCircle, User, Camera } from "lucide-react";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import { getMemberItems, Item, ITEM_STATUS } from "@src/api/itemsApi";
import ItemCard from "@src/app/member/items/components/ItemCard";
import { getMemberProfile, MemberProfile } from "@src/api/memberApi";
import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { useToast } from "@src/hooks/use-toast";

export default function MemberPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.MEMBER}>
      <MemberItemsContent />
    </AuthenticatedPage>
  );
}

function MemberItemsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const normalizeTabParam = (
    tab: string | null
  ): "in-store" | "unlisted" | "sold" | null => {
    if (tab === "at-home") return "unlisted";
    if (tab === "in-store" || tab === "unlisted" || tab === "sold") return tab;
    return null;
  };

  const initialTab = useMemo(
    () => normalizeTabParam(tabParam) ?? "in-store",
    [tabParam]
  );

  const [activeTab, setActiveTab] = useState<"in-store" | "unlisted" | "sold">(initialTab);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

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

  // Load member profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getMemberProfile();
        if (result.success && result.data) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Error loading member profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Handle photo preview
  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photoFile]);

  // Handle photo upload
  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setIsUploadingPhoto(true);
    try {
      const form = new FormData();
      form.append("profile_photo", photoFile);
      const res = await fetchClient({
        method: "POST",
        url: API_ROUTES.MEMBERS.PROFILE_PHOTO,
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUrl =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res.data as any)?.profile_photo_url ?? null;
      setProfile((prev) =>
        prev ? { ...prev, profile_photo_url: updatedUrl ?? null } : prev
      );
      setPhotoFile(null);
      setPhotoPreviewUrl(null);
      setPhotoModalOpen(false);
      toast({ title: "Photo updated" });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Failed to upload photo",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle photo remove
  const handlePhotoRemove = async () => {
    setIsUploadingPhoto(true);
    try {
      await fetchClient({
        method: "DELETE",
        url: API_ROUTES.MEMBERS.PROFILE_PHOTO,
      });
      setProfile((prev) =>
        prev ? { ...prev, profile_photo_url: null } : prev
      );
      setPhotoFile(null);
      setPhotoPreviewUrl(null);
      setPhotoModalOpen(false);
      toast({ title: "Photo removed" });
    } catch (error) {
      console.error("Error removing photo:", error);
      toast({
        title: "Failed to remove photo",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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

  useEffect(() => {
    const normalized = normalizeTabParam(tabParam);
    if (normalized && normalized !== activeTab) {
      setActiveTab(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

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
          case "unlisted":
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
                atHomeResult.error || "Failed to load available items"
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

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('blob:')) return imageUrl;
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_t=${Date.now()}`;
  };

  const photoSrc = photoPreviewUrl ?? profile?.profile_photo_url ?? null;

  const photoDirty = photoFile !== null;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-6 flex flex-row flex-wrap items-end justify-between gap-3">
        <div className="flex items-end gap-4">
          <div className="relative shrink-0 group">
            {profileLoading ? (
              <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full bg-muted animate-pulse" />
            ) : photoSrc ? (
              <div className="relative h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden bg-muted">
                <Image
                  src={getImageUrl(photoSrc)}
                  alt={profile?.username || "Profile"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 text-muted-foreground" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f) {
                  setPhotoFile(f);
                  setPhotoModalOpen(true);
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null);
                setPhotoPreviewUrl(null);
                setPhotoModalOpen(true);
              }}
              disabled={isUploadingPhoto}
              className="absolute bottom-0 right-0 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full bg-background border-2 border-foreground/10 flex items-center justify-center shadow-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-muted-foreground" />
            </button>
          </div>
          {profile?.username && (
            <div className="flex items-end pb-2">
              <span className="text-lg md:text-xl lg:text-2xl font-medium text-foreground">
                {profile.username}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-end pb-2 shrink-0">
          <Link href={Routes.MEMBER.ITEMS.NEW}>
            <Button size="sm" variant="default" className="lg:text-base lg:px-4 lg:py-2">
              New Item
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const nextTab = value as "in-store" | "unlisted" | "sold";
          setActiveTab(nextTab);
          router.replace(`${Routes.MEMBER.ROOT}?tab=${nextTab}`, { scroll: false });
        }}
        className="w-full"
      >
        <TabsList variant="pill">
          <TabsTrigger variant="secondary" value="in-store">
            <span>In Store</span>
            {recalledCount > 0 && (
              <Badge
                variant="destructive"
                className="pointer-events-none h-4 min-w-4 px-1 flex items-center justify-center text-[10px] sm:h-5 sm:min-w-5 sm:px-1.5 sm:text-xs"
              >
                {recalledCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="unlisted">
            <span>Available</span>
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="sold">
            <span>Sold</span>
          </TabsTrigger>
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
                  <ItemCard key={item.id} item={item} tab={activeTab} />
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

        <TabsContent value="unlisted" className="mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : atHomeError ? (
            <div className="text-destructive">{atHomeError}</div>
          ) : atHomeItems.length === 0 ? (
            <div className="text-muted-foreground">No items available to list.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {atHomeItems.map((item) => (
                  <ItemCard key={item.id} item={item} tab={activeTab} />
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
                  <ItemCard key={item.id} item={item} tab={activeTab} />
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

      {/* Photo Upload Modal */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent className="border-0">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
                {photoPreviewUrl || profile?.profile_photo_url ? (
                  <Image
                    src={getImageUrl(photoPreviewUrl || profile?.profile_photo_url || "")}
                    alt="Profile photo preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                    Photo
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    if (f) {
                      setPhotoFile(f);
                    }
                  }}
                />
                <div className="flex flex-row flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose photo
                  </Button>
                  {profile?.profile_photo_url && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePhotoRemove}
                      disabled={isUploadingPhoto}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Square images work best.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPhotoModalOpen(false);
                setPhotoFile(null);
                setPhotoPreviewUrl(null);
              }}
              disabled={isUploadingPhoto}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhotoUpload}
              disabled={!photoDirty || isUploadingPhoto}
            >
              {isUploadingPhoto ? "Uploading..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
