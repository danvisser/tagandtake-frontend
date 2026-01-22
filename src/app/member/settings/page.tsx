"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { Routes } from "@src/constants/routes";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { useToast } from "@src/hooks/use-toast";
import { getMemberProfile, MemberProfile } from "@src/api/memberApi";
import { getMemberItems } from "@src/api/itemsApi";
import { ITEM_STATUS } from "@src/constants/itemStatuses";
import Image from "next/image";
import { User, Camera, Trash2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@src/stores/authStore";

export default function MemberSettingsPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.MEMBER}>
      <MemberSettingsContent />
    </AuthenticatedPage>
  );
}

function MemberSettingsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { logout } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  // Form states
  const [email, setEmail] = useState("");

  // Initial values for dirty check
  const [initialEmail, setInitialEmail] = useState("");

  // Photo states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete account states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [hasActiveListings, setHasActiveListings] = useState(false);
  const [checkingListings, setCheckingListings] = useState(true);

  // Loading profile
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMemberProfile();
        if (result.success && result.data) {
          setProfile(result.data);
          setEmail(result.data.email || "");
          setInitialEmail(result.data.email || "");
        } else {
          setError(result.error || "Failed to load profile");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Check for active or recalled listings
  useEffect(() => {
    const checkListings = async () => {
      setCheckingListings(true);
      try {
        // Check for LISTED and RECALLED items
        const [listedResult, recalledResult] = await Promise.all([
          getMemberItems({ status: ITEM_STATUS.LISTED, page: 1 }),
          getMemberItems({ status: ITEM_STATUS.RECALLED, page: 1 }),
        ]);

        const hasListed =
          listedResult.success &&
          listedResult.data &&
          listedResult.data.results &&
          listedResult.data.results.length > 0;
        const hasRecalled =
          recalledResult.success &&
          recalledResult.data &&
          recalledResult.data.results &&
          recalledResult.data.results.length > 0;

        setHasActiveListings(Boolean(hasListed || hasRecalled));
      } catch (err) {
        console.error("Error checking listings:", err);
        // On error, assume they might have listings, so disable delete
        setHasActiveListings(true);
      } finally {
        setCheckingListings(false);
      }
    };

    checkListings();
  }, []);

  // Sync email state with profile when profile first loads
  useEffect(() => {
    if (profile?.email && !email && !initialEmail) {
      setEmail(profile.email);
      setInitialEmail(profile.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Handle photo preview
  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPhotoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreviewUrl(null);
    }
  }, [photoFile]);

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("blob:")) return imageUrl;
    const separator = imageUrl.includes("?") ? "&" : "?";
    return `${imageUrl}${separator}_t=${Date.now()}`;
  };

  const photoSrc = photoPreviewUrl ?? profile?.profile_photo_url ?? null;

  const profileDirty = email !== initialEmail;

  const handleSaveProfile = async () => {
    try {
      const res = await fetchClient({
        method: "PATCH",
        url: API_ROUTES.MEMBERS.PROFILE,
        data: {
          email: email.trim(),
        },
      });
      const updatedProfile = res.data as MemberProfile;
      setProfile(updatedProfile);
      setEmail(updatedProfile.email || "");
      setInitialEmail(updatedProfile.email || "");
      toast({ title: "Profile updated" });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Failed to update profile",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await fetchClient({
        method: "DELETE",
        url: API_ROUTES.MEMBERS.DELETE_ACCOUNT,
      });
      toast({ title: "Account deleted" });
      await logout();
      router.push(Routes.HOME);
    } catch (error) {
      console.error("Error deleting account:", error);
      
      // Extract error message from response
      let errorMessage = "Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = (error as any).response?.data;
        if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (responseData?.detail) {
          errorMessage = responseData.detail;
        }
      }
      
      setDeleteError(errorMessage);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-4xl">
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
          <h1 className="text-3xl font-normal leading-8">Account Settings</h1>
        </div>
        <Button asChild variant="secondary" size="sm" className="text-muted-foreground border-muted-foreground">
          <Link
            href={Routes.MEMBER.PAYMENTS}
            className="flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Manage payments
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row flex-wrap items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
                {photoSrc ? (
                  <Image
                    src={getImageUrl(photoSrc)}
                    alt={profile?.username || "Profile"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                    <User className="h-8 w-8 text-muted-foreground" />
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
                      setPhotoModalOpen(true);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreviewUrl(null);
                    setPhotoModalOpen(true);
                  }}
                  disabled={isUploadingPhoto}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {photoSrc ? "Change photo" : "Upload photo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email || profile?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={profile?.username || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Username cannot be changed</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={!profileDirty}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Change your password to keep your account secure.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(Routes.PASSWORD.RESET)}
              >
                Change password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Delete account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasActiveListings ? (
              <>
                <p className="text-sm">
                  All items must be collected from stores before account can be
                  deleted.{" "}
                  <Link
                    href={`${Routes.MEMBER.ITEMS.ROOT}?tab=in-store`}
                    className="text-primary underline hover:text-primary/80"
                  >
                    View items in store
                  </Link>
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled
                  className="cursor-not-allowed opacity-60"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete account
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={checkingListings}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete account
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Photo Modal */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {photoSrc ? "Change profile photo" : "Upload profile photo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {photoPreviewUrl && (
              <div className="relative h-48 w-48 mx-auto overflow-hidden rounded-full bg-muted">
                <Image
                  src={photoPreviewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f) setPhotoFile(f);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoFile ? "Change photo" : "Choose photo"}
              </Button>
              {photoSrc && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePhotoRemove}
                  disabled={isUploadingPhoto}
                >
                  Remove photo
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
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
            {photoFile && (
              <Button
                type="button"
                onClick={handlePhotoUpload}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? "Uploading..." : "Upload"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{deleteError}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteError(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
