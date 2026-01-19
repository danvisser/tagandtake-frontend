"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Textarea } from "@src/components/ui/textarea";
import { Checkbox } from "@src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { useToast } from "@src/hooks/use-toast";
import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { Routes } from "@src/constants/routes";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import { UserRoles } from "@src/types/roles";
import { generateNewStorePin } from "@src/api/storeApi";
import type {
  StoreAddress,
  StoreNotificationPreferences,
  StoreOpeningHours,
  StoreProfile,
} from "@src/api/storeApi";

type PendingSave =
  | { kind: "profile" }
  | { kind: "address" }
  | { kind: "hours" }
  | { kind: "notifications" }
  | { kind: "photo_upload" }
  | { kind: "photo_remove" }
  | null;

const DAYS: Array<{ key: string; label: string }> = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const emptyAddress = (): StoreAddress => ({
  street_address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  latitude: undefined,
  longitude: undefined,
});

const normalizeId = (s: string) => s.trim().toLowerCase();

const normalizeUrlOrNull = (s: string) => {
  const v = s.trim();
  return v.length ? v : null;
};

const normalizeStringOrNull = (s: string) => {
  const v = s.trim();
  return v.length ? v : null;
};

const pickProfileDraft = (p: StoreProfile | null) => ({
  store_name: p?.store_name ?? "",
  phone: p?.phone ?? "",
  store_bio: p?.store_bio ?? "",
  website_url: p?.website_url ?? "",
  instagram_url: p?.instagram_url ?? "",
  google_profile_url: p?.google_profile_url ?? "",
});

const normalizeHours = (
  hours: StoreOpeningHours[] | undefined
): StoreOpeningHours[] => {
  const base: StoreOpeningHours[] = DAYS.map((d) => ({
    day_of_week: d.key,
    opening_time: undefined,
    closing_time: undefined,
    timezone: undefined,
    is_closed: true,
  }));

  const byDay = new Map(
    (hours ?? [])
      .filter((h) => typeof h?.day_of_week === "string")
      .map((h) => [normalizeId(h.day_of_week), h])
  );

  return base.map((row) => {
    const existing = byDay.get(normalizeId(row.day_of_week));
    if (!existing) return row;
    return {
      day_of_week: row.day_of_week,
      opening_time: existing.opening_time ?? undefined,
      closing_time: existing.closing_time ?? undefined,
      timezone: existing.timezone ?? undefined,
      is_closed: existing.is_closed ?? false,
    };
  });
};

export default function StoreProfilePage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreProfileContent />
    </AuthenticatedPage>
  );
}

function StoreProfileContent() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<StoreProfile | null>(null);

  const [profileDraft, setProfileDraft] = useState(() => pickProfileDraft(null));
  const [initialProfileDraft, setInitialProfileDraft] = useState(() =>
    pickProfileDraft(null)
  );

  const [addressDraft, setAddressDraft] = useState<StoreAddress>(emptyAddress);
  const [initialAddressDraft, setInitialAddressDraft] =
    useState<StoreAddress>(emptyAddress);

  const [hoursDraft, setHoursDraft] = useState<StoreOpeningHours[]>(() =>
    normalizeHours(undefined)
  );
  const [initialHoursDraft, setInitialHoursDraft] = useState<
    StoreOpeningHours[]
  >(() => normalizeHours(undefined));

  const [notificationsDraft, setNotificationsDraft] =
    useState<StoreNotificationPreferences>({
      secondary_email: "",
      new_listing_notifications: false,
      sale_notifications: false,
    });
  const [initialNotificationsDraft, setInitialNotificationsDraft] =
    useState<StoreNotificationPreferences>({
      secondary_email: "",
      new_listing_notifications: false,
      sale_notifications: false,
    });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSaving, setIsSaving] = useState<{
    profile: boolean;
    address: boolean;
    hours: boolean;
    notifications: boolean;
    photo: boolean;
  }>({
    profile: false,
    address: false,
    hours: false,
    notifications: false,
    photo: false,
  });

  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinDialogValue, setPinDialogValue] = useState("");
  const [pinDialogError, setPinDialogError] = useState<string | null>(null);
  const [pendingSave, setPendingSave] = useState<PendingSave>(null);
  const [isSubmittingWithPin, setIsSubmittingWithPin] = useState(false);

  const [requestPinDialogOpen, setRequestPinDialogOpen] = useState(false);
  const [requestPinIsSubmitting, setRequestPinIsSubmitting] = useState(false);
  const [requestPinSent, setRequestPinSent] = useState(false);
  const [requestPinError, setRequestPinError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, notifRes] = await Promise.all([
          fetchClient({
            method: "GET",
            url: API_ROUTES.STORES.PROFILE,
          }),
          fetchClient({
            method: "GET",
            url: API_ROUTES.STORES.NOTIFICATION_SETTINGS,
          }),
        ]);

        const p = profileRes.data as StoreProfile;
        setProfile(p);
        const pd = pickProfileDraft(p);
        setProfileDraft(pd);
        setInitialProfileDraft(pd);

        const addr = p.store_address ?? emptyAddress();
        setAddressDraft(addr);
        setInitialAddressDraft(addr);

        const hours = normalizeHours(p.opening_hours);
        setHoursDraft(hours);
        setInitialHoursDraft(hours);

        const n = notifRes.data as StoreNotificationPreferences;
        const nd: StoreNotificationPreferences = {
          secondary_email: n.secondary_email ?? "",
          new_listing_notifications: Boolean(n.new_listing_notifications),
          sale_notifications: Boolean(n.sale_notifications),
        };
        setNotificationsDraft(nd);
        setInitialNotificationsDraft(nd);
      } catch (err) {
        console.error("Failed to load store profile:", err);
        setError("Failed to load your store profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const profileDirty = useMemo(() => {
    return JSON.stringify(profileDraft) !== JSON.stringify(initialProfileDraft);
  }, [profileDraft, initialProfileDraft]);

  const addressDirty = useMemo(() => {
    return JSON.stringify(addressDraft) !== JSON.stringify(initialAddressDraft);
  }, [addressDraft, initialAddressDraft]);

  const hoursDirty = useMemo(() => {
    const norm = (h: StoreOpeningHours[]) =>
      h
        .slice()
        .sort((a, b) =>
          normalizeId(a.day_of_week).localeCompare(normalizeId(b.day_of_week))
        )
        .map((x) => ({
          day_of_week: normalizeId(x.day_of_week),
          opening_time: x.opening_time ?? null,
          closing_time: x.closing_time ?? null,
          timezone: x.timezone ?? null,
          is_closed: Boolean(x.is_closed),
        }));
    return (
      JSON.stringify(norm(hoursDraft)) !== JSON.stringify(norm(initialHoursDraft))
    );
  }, [hoursDraft, initialHoursDraft]);

  const notificationsDirty = useMemo(() => {
    return (
      JSON.stringify(notificationsDraft) !==
      JSON.stringify(initialNotificationsDraft)
    );
  }, [notificationsDraft, initialNotificationsDraft]);

  const photoDirty = Boolean(photoFile);

  const openPinDialog = (next: Exclude<PendingSave, null>) => {
    setPendingSave(next);
    setPinDialogValue("");
    setPinDialogError(null);
    setPinDialogOpen(true);
  };

  const closePinDialog = () => {
    setPinDialogOpen(false);
    setPinDialogValue("");
    setPinDialogError(null);
    setPendingSave(null);
  };

  const openRequestPinDialog = () => {
    setRequestPinSent(false);
    setRequestPinError(null);
    setRequestPinDialogOpen(true);
    setPinDialogOpen(false);
  };

  const extractDetail = (err: unknown): string | null => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail = (err as any)?.response?.data?.detail;
    return typeof detail === "string" ? detail : null;
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
      if (pendingSave.kind === "profile") {
        setIsSaving((s) => ({ ...s, profile: true }));
        const res = await fetchClient({
          method: "PATCH",
          url: API_ROUTES.STORES.PROFILE,
          data: {
            pin,
            store_name: profileDraft.store_name.trim(),
            phone: normalizeStringOrNull(profileDraft.phone),
            store_bio: normalizeStringOrNull(profileDraft.store_bio),
            website_url: normalizeUrlOrNull(profileDraft.website_url),
            instagram_url: normalizeUrlOrNull(profileDraft.instagram_url),
            google_profile_url: normalizeUrlOrNull(profileDraft.google_profile_url),
          },
        });
        const p = res.data as StoreProfile;
        setProfile(p);
        const pd = pickProfileDraft(p);
        setProfileDraft(pd);
        setInitialProfileDraft(pd);
        toast({ title: "Profile updated" });
      }

      if (pendingSave.kind === "address") {
        setIsSaving((s) => ({ ...s, address: true }));
        const res = await fetchClient({
          method: "PATCH",
          url: API_ROUTES.STORES.PROFILE,
          data: {
            pin,
            store_address: {
              street_address: addressDraft.street_address,
              city: addressDraft.city,
              state: addressDraft.state || null,
              postal_code: addressDraft.postal_code,
              country: addressDraft.country,
              latitude: addressDraft.latitude,
              longitude: addressDraft.longitude,
            },
          },
        });
        const p = res.data as StoreProfile;
        setProfile(p);
        const addr = p.store_address ?? emptyAddress();
        setAddressDraft(addr);
        setInitialAddressDraft(addr);
        toast({ title: "Address updated" });
      }

      if (pendingSave.kind === "hours") {
        setIsSaving((s) => ({ ...s, hours: true }));
        const cleaned = hoursDraft.map((h) => ({
          day_of_week: h.day_of_week,
          is_closed: Boolean(h.is_closed),
          timezone: h.timezone ?? null,
          opening_time: h.is_closed ? null : h.opening_time ?? null,
          closing_time: h.is_closed ? null : h.closing_time ?? null,
        }));
        const res = await fetchClient({
          method: "PATCH",
          url: API_ROUTES.STORES.PROFILE,
          data: {
            pin,
            opening_hours: cleaned,
          },
        });
        const p = res.data as StoreProfile;
        setProfile(p);
        const hours = normalizeHours(p.opening_hours);
        setHoursDraft(hours);
        setInitialHoursDraft(hours);
        toast({ title: "Opening hours updated" });
      }

      if (pendingSave.kind === "notifications") {
        setIsSaving((s) => ({ ...s, notifications: true }));
        const res = await fetchClient({
          method: "PATCH",
          url: API_ROUTES.STORES.NOTIFICATION_SETTINGS,
          data: {
            pin,
            secondary_email: normalizeStringOrNull(
              notificationsDraft.secondary_email ?? ""
            ),
            new_listing_notifications: Boolean(
              notificationsDraft.new_listing_notifications
            ),
            sale_notifications: Boolean(notificationsDraft.sale_notifications),
          },
        });
        const n = res.data as StoreNotificationPreferences;
        const nd: StoreNotificationPreferences = {
          secondary_email: n.secondary_email ?? "",
          new_listing_notifications: Boolean(n.new_listing_notifications),
          sale_notifications: Boolean(n.sale_notifications),
        };
        setNotificationsDraft(nd);
        setInitialNotificationsDraft(nd);
        toast({ title: "Notifications updated" });
      }

      if (pendingSave.kind === "photo_upload") {
        if (!photoFile) return;
        setIsSaving((s) => ({ ...s, photo: true }));
        const form = new FormData();
        form.append("pin", pin);
        form.append("profile_photo", photoFile);
        const res = await fetchClient({
          method: "POST",
          url: API_ROUTES.STORES.PROFILE_PHOTO,
          data: form,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const updatedUrl =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res.data as any)?.profile_photo_url ?? null;
        setProfile((prev) =>
          prev ? { ...prev, profile_photo_url: updatedUrl ?? undefined } : prev
        );
        setPhotoFile(null);
        toast({ title: "Photo updated" });
      }

      if (pendingSave.kind === "photo_remove") {
        setIsSaving((s) => ({ ...s, photo: true }));
        await fetchClient({
          method: "DELETE",
          url: API_ROUTES.STORES.PROFILE_PHOTO,
          data: { pin },
        });
        setProfile((prev) =>
          prev ? { ...prev, profile_photo_url: undefined } : prev
        );
        setPhotoFile(null);
        toast({ title: "Photo removed" });
      }

      closePinDialog();
    } catch (err) {
      const detail = extractDetail(err);
      if (detail === "PIN is required." || detail === "Invalid PIN.") {
        setPinDialogError(detail);
        return;
      }
      console.error("Failed to save store profile:", err);
      toast({
        title: "Failed to save changes",
        description: detail ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving({
        profile: false,
        address: false,
        hours: false,
        notifications: false,
        photo: false,
      });
      setIsSubmittingWithPin(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading store profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const photoSrc = photoPreviewUrl ?? profile?.profile_photo_url ?? null;

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-normal leading-8">Store Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your store details, opening hours, and notifications.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={Routes.STORE.SETTINGS}>Marketplace settings</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Store photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row flex-wrap items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-muted">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt="Store profile photo"
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
                    setPhotoFile(f);
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
                      onClick={() => openPinDialog({ kind: "photo_remove" })}
                      disabled={isSaving.photo || isSubmittingWithPin}
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

            <div className="flex justify-end">
              <Button
                onClick={() => openPinDialog({ kind: "photo_upload" })}
                disabled={!photoDirty || isSaving.photo || isSubmittingWithPin}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="store_name">Store name</Label>
                <Input
                  id="store_name"
                  value={profileDraft.store_name}
                  onChange={(e) =>
                    setProfileDraft((p) => ({
                      ...p,
                      store_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileDraft.phone}
                  onChange={(e) =>
                    setProfileDraft((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="store_bio">Store bio</Label>
                <Textarea
                  id="store_bio"
                  value={profileDraft.store_bio}
                  onChange={(e) =>
                    setProfileDraft((p) => ({ ...p, store_bio: e.target.value }))
                  }
                  className="min-h-28"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => openPinDialog({ kind: "profile" })}
                disabled={!profileDirty || isSaving.profile || isSubmittingWithPin}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input
                  id="website_url"
                  placeholder="https://"
                  value={profileDraft.website_url}
                  onChange={(e) =>
                    setProfileDraft((p) => ({
                      ...p,
                      website_url: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  placeholder="https://instagram.com/..."
                  value={profileDraft.instagram_url}
                  onChange={(e) =>
                    setProfileDraft((p) => ({
                      ...p,
                      instagram_url: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="google_profile_url">
                  Google profile / Maps link
                </Label>
                <Input
                  id="google_profile_url"
                  placeholder="https://"
                  value={profileDraft.google_profile_url}
                  onChange={(e) =>
                    setProfileDraft((p) => ({
                      ...p,
                      google_profile_url: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => openPinDialog({ kind: "profile" })}
                disabled={!profileDirty || isSaving.profile || isSubmittingWithPin}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="street_address">Street address</Label>
                <Input
                  id="street_address"
                  value={addressDraft.street_address}
                  onChange={(e) =>
                    setAddressDraft((a) => ({
                      ...a,
                      street_address: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressDraft.city}
                  onChange={(e) =>
                    setAddressDraft((a) => ({ ...a, city: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / region</Label>
                <Input
                  id="state"
                  value={addressDraft.state ?? ""}
                  onChange={(e) =>
                    setAddressDraft((a) => ({ ...a, state: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postcode</Label>
                <Input
                  id="postal_code"
                  value={addressDraft.postal_code}
                  onChange={(e) =>
                    setAddressDraft((a) => ({
                      ...a,
                      postal_code: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addressDraft.country}
                  onChange={(e) =>
                    setAddressDraft((a) => ({
                      ...a,
                      country: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => openPinDialog({ kind: "address" })}
                disabled={!addressDirty || isSaving.address || isSubmittingWithPin}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opening hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {hoursDraft.map((h, idx) => {
                const label =
                  DAYS.find((d) => d.key === h.day_of_week)?.label ??
                  h.day_of_week;
                return (
                  <div
                    key={h.day_of_week}
                    className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-center"
                  >
                    <div className="text-sm font-medium">{label}</div>
                    <div className="flex flex-row flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={Boolean(h.is_closed)}
                          onCheckedChange={(checked) => {
                            const isClosed = Boolean(checked);
                            setHoursDraft((prev) =>
                              prev.map((row, i) =>
                                i === idx
                                  ? {
                                      ...row,
                                      is_closed: isClosed,
                                      opening_time: isClosed
                                        ? undefined
                                        : row.opening_time,
                                      closing_time: isClosed
                                        ? undefined
                                        : row.closing_time,
                                    }
                                  : row
                              )
                            );
                          }}
                        />
                        Closed
                      </label>

                      <Input
                        type="time"
                        className="w-[140px]"
                        value={h.opening_time ?? ""}
                        disabled={Boolean(h.is_closed)}
                        onChange={(e) => {
                          const v = e.target.value;
                          setHoursDraft((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, opening_time: v } : row
                            )
                          );
                        }}
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="time"
                        className="w-[140px]"
                        value={h.closing_time ?? ""}
                        disabled={Boolean(h.is_closed)}
                        onChange={(e) => {
                          const v = e.target.value;
                          setHoursDraft((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, closing_time: v } : row
                            )
                          );
                        }}
                      />
                      <Input
                        placeholder="Timezone (optional)"
                        className="w-[220px]"
                        value={h.timezone ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setHoursDraft((prev) =>
                            prev.map((row, i) =>
                              i === idx ? { ...row, timezone: v } : row
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => openPinDialog({ kind: "hours" })}
                disabled={!hoursDirty || isSaving.hours || isSubmittingWithPin}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={Boolean(notificationsDraft.new_listing_notifications)}
                  onCheckedChange={(checked) =>
                    setNotificationsDraft((n) => ({
                      ...n,
                      new_listing_notifications: Boolean(checked),
                    }))
                  }
                />
                New listings / drop-offs
              </label>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={Boolean(notificationsDraft.sale_notifications)}
                  onCheckedChange={(checked) =>
                    setNotificationsDraft((n) => ({
                      ...n,
                      sale_notifications: Boolean(checked),
                    }))
                  }
                />
                Sales
              </label>

              <div className="space-y-2 max-w-md">
                <Label htmlFor="secondary_email">
                  Secondary email (optional)
                </Label>
                <Input
                  id="secondary_email"
                  placeholder="name@store.com"
                  value={notificationsDraft.secondary_email ?? ""}
                  onChange={(e) =>
                    setNotificationsDraft((n) => ({
                      ...n,
                      secondary_email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => openPinDialog({ kind: "notifications" })}
                disabled={
                  !notificationsDirty ||
                  isSaving.notifications ||
                  isSubmittingWithPin
                }
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <DialogDescription>
              Your store PIN is required to update these details.
            </DialogDescription>
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

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closePinDialog}
              disabled={isSubmittingWithPin}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitWithPin}
              disabled={isSubmittingWithPin}
            >
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
                We&apos;ll generate a new store PIN and email it to you. Your
                existing PIN will no longer work.
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
